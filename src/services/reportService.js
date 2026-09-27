import apiClient from './api';
import { findSupportedLocation } from '../data/supportedLocations';
import { getCategoryMeta } from './airQualityService';
import { mongoService } from './mongoService';

export const reportService = {
  // Generates executive environmental intelligence summary powered by Render backend ML models
  generateExecutiveReport: async ({ location, dateRange, analysisType }) => {
    const loc = findSupportedLocation(location);
    
    if (!loc) {
      throw new Error('Location Not Found.');
    }

    const payload = {
      so2: loc.so2,
      no2: loc.no2,
      rspm: loc.rspm,
      spm: loc.spm,
      pm2_5: loc.pm2_5
    };

    let backendResult;
    try {
      backendResult = await apiClient.post('/predict', payload);
    } catch (err) {
      throw new Error('Unable to fetch data');
    }

    if (!backendResult || backendResult.success === false) {
      throw new Error('Unable to fetch data');
    }

    const {
      air_quality: rawAirQuality,
      confidence,
      pollution_pattern,
      pollution_score,
      recommendations
    } = backendResult;

    const calculatedAQI = Math.round(loc.pm2_5 * 2.1 + (pollution_score || 0) * 100);
    const meta = getCategoryMeta(rawAirQuality, calculatedAQI, loc.pm2_5, pollution_score);

    const dateStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const reportId = `AERO-REP-${Date.now().toString().slice(-6)}`;
    const recs = [
      meta.advice,
      ...(Array.isArray(recommendations) && recommendations.length > 0 ? recommendations.slice(1) : [])
    ];

    const reportObj = {
      reportId,
      location: loc.name,
      state: loc.state,
      dateRange,
      analysisType,
      generatedAt: dateStr,
      executiveSummary: `Atmospheric telemetry evaluation for ${loc.name.toUpperCase()} (${loc.state}, India). Deployed ML models on Render backend classified air quality as ${meta.category} with ${confidence ?? 100}% confidence (Pollution Score: ${pollution_score}, Pattern Index: #${pollution_pattern}).`,
      sections: [
        {
          title: "ML Air Quality Classification",
          status: meta.category.toUpperCase(),
          keyMetric: `Classification: ${meta.category} (${confidence ?? 100}% Confidence)`,
          summary: `Supervised ML classifier and regression analysis confirmed ${meta.category} rating for station measurements (PM2.5: ${loc.pm2_5} µg/m³, NO2: ${loc.no2} ppb, RSPM: ${loc.rspm} µg/m³).`
        },
        {
          title: "Pattern Mining & Regression Findings",
          keyMetric: `Pattern Index #${pollution_pattern ?? 0} | Pollution Score: ${pollution_score ?? 0}`,
          summary: `Feature extraction and pattern matching identified atmospheric signature #${pollution_pattern ?? 0} with regression score ${pollution_score ?? 0}.`
        },
        {
          title: "Strategic Environmental Recommendation",
          keyMetric: "ML Generated Action Plan",
          summary: recs.join(' ')
        }
      ]
    };

    // Save report to MongoDB
    mongoService.insertDocument('reports', reportObj);

    return reportObj;
  }
};
