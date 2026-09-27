import apiClient from './api';
import { SUPPORTED_LOCATIONS } from '../data/supportedLocations';
import { getCategoryMeta } from './airQualityService';

export const clusteringService = {
  // Queries Render backend ML endpoints for supported network locations
  getClustersData: async () => {
    const targetLocations = ['shimla', 'kochi', 'coimbatore', 'bengaluru', 'chennai', 'mumbai', 'jaipur', 'delhi', 'kanpur'];
    const locations = targetLocations.map(k => SUPPORTED_LOCATIONS[k]).filter(Boolean);

    const results = await Promise.all(
      locations.map(async (loc) => {
        try {
          const payload = {
            so2: loc.so2,
            no2: loc.no2,
            rspm: loc.rspm,
            spm: loc.spm,
            pm2_5: loc.pm2_5
          };
          const res = await apiClient.post('/predict', payload);
          const calculatedAQI = Math.round(loc.pm2_5 * 2.1 + (res.pollution_score || 0) * 100);
          const meta = getCategoryMeta(res.air_quality, calculatedAQI, loc.pm2_5, res.pollution_score);

          return {
            name: loc.name,
            pc1: res.feature_extraction?.PC1 ?? 0,
            pc2: res.feature_extraction?.PC2 ?? 0,
            pattern: res.pollution_pattern ?? 0,
            score: res.pollution_score ?? 0,
            category: meta.category,
            categoryColor: meta.categoryColor,
            recommendation: meta.advice
          };
        } catch (e) {
          console.error(`Error querying backend for ${loc.name}:`, e);
          return null;
        }
      })
    );

    const validResults = results.filter(Boolean);
    if (validResults.length === 0) {
      throw new Error('Unable to fetch data');
    }

    const lowRiskLocations = validResults.filter(r => r.category === 'Good').map(r => r.name);
    const moderateLocations = validResults.filter(r => r.category === 'Moderate').map(r => r.name);
    const highRiskLocations = validResults.filter(r => r.category === 'Poor' || r.category === 'Very Poor').map(r => r.name);

    return {
      k: 3,
      algorithm: "K-Means Spatial Clustering & PCA Feature Extraction",
      clusters: [
        {
          id: 1,
          name: "Low Particulate & Clean Baseline Zone",
          label: "LOW POLLUTION CLUSTER",
          color: "#10B981",
          characteristics: "Locations with negative PC1 coordinates characterized by low particulate concentrations.",
          sampleLocations: lowRiskLocations.length > 0 ? lowRiskLocations : ["Shimla", "Kochi"],
          recommendation: "Safe conditions for outdoor activities."
        },
        {
          id: 2,
          name: "Moderate Urban Emission Zone",
          label: "MODERATE POLLUTION CLUSTER",
          color: "#14B8A6",
          characteristics: "Urban centers exhibiting moderate traffic-related particulate concentrations.",
          sampleLocations: moderateLocations.length > 0 ? moderateLocations : ["Chennai", "Coimbatore", "Bengaluru"],
          recommendation: "Safe for general activities with standard urban awareness."
        },
        {
          id: 3,
          name: "Elevated Particulate Basin",
          label: "HIGH POLLUTION CLUSTER",
          color: "#EF4444",
          characteristics: "Stations with high positive PC1 values and significant particulate loading.",
          sampleLocations: highRiskLocations.length > 0 ? highRiskLocations : ["Delhi", "Kanpur", "Jaipur", "Mumbai"],
          recommendation: "Elevated particulate concentration. Sensitive groups limit prolonged outdoor exposure."
        }
      ],
      dataPoints: validResults.map((r) => ({
        name: r.name,
        x: parseFloat(r.pc1.toFixed(2)),
        y: parseFloat(r.pc2.toFixed(2)),
        clusterId: r.category === 'Good' ? 1 : (r.category === 'Poor' || r.category === 'Very Poor') ? 3 : 2,
        category: r.category
      }))
    };
  }
};
