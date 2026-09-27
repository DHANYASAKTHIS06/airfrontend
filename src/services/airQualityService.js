import apiClient from './api';
import { SUPPORTED_LOCATIONS, findSupportedLocation } from '../data/supportedLocations';
import { mongoService } from './mongoService';

// Category metadata helper evaluating multi-factor atmospheric indices
export function getCategoryMeta(airQualityLabel, calculatedAQI, pm25, pollutionScore) {
  // If a calculated AQI or PM2.5 is provided, evaluate standard CPCB/NAAQ category thresholds
  let category = airQualityLabel;

  if (calculatedAQI !== undefined || pm25 !== undefined) {
    const aqi = calculatedAQI !== undefined ? calculatedAQI : (pm25 * 2.1);
    if (aqi > 200 || (pm25 !== undefined && pm25 > 90) || (pollutionScore !== undefined && pollutionScore >= 0.07)) {
      category = 'Very Poor';
    } else if (aqi > 100 || (pm25 !== undefined && pm25 > 50) || (pollutionScore !== undefined && pollutionScore >= 0.04)) {
      category = 'Poor';
    } else if (aqi > 50 || (pm25 !== undefined && pm25 > 25)) {
      category = 'Moderate';
    } else {
      category = 'Good';
    }
  }

  const lower = (category || '').toLowerCase();

  if (lower.includes('very poor') || lower.includes('severe') || lower.includes('hazardous')) {
    return { 
      category: 'Very Poor', 
      categoryColor: '#EF4444', 
      mainConcern: 'Severe Toxic Particulate Stagnation',
      advice: 'Avoid prolonged outdoor physical exertion. Keep windows sealed and wear an N95 mask outdoors.'
    };
  } else if (lower.includes('poor')) {
    return { 
      category: 'Poor', 
      categoryColor: '#F59E0B', 
      mainConcern: 'Elevated Fine Particulate Dispersion',
      advice: 'Air quality is unhealthy for sensitive groups. Reduce heavy outdoor physical activity.'
    };
  } else if (lower.includes('moderate') || lower.includes('acceptable')) {
    return { 
      category: 'Moderate', 
      categoryColor: '#14B8A6', 
      mainConcern: 'Moderate Vehicular & Particulate Load',
      advice: 'Air quality is acceptable for the general population; sensitive individuals observe standard caution.'
    };
  }

  return { 
    category: 'Good', 
    categoryColor: '#10B981', 
    mainConcern: 'Minimal Particulate Load',
    advice: 'Air quality is satisfactory. Ideal conditions for outdoor physical exercise and recreation.'
  };
}

const HISTORY_KEY = 'aero_search_history';
const FAVORITES_KEY = 'aero_favorites';

export const airQualityService = {
  // Query deployed Render backend ML model for a supported location
  getAirQuality: async (locationName) => {
    const loc = findSupportedLocation(locationName);
    
    if (!loc) {
      const err = new Error('Location Not Found.');
      err.isNotFound = true;
      throw err;
    }

    const payload = {
      so2: Number(loc.so2),
      no2: Number(loc.no2),
      rspm: Number(loc.rspm),
      spm: Number(loc.spm),
      pm2_5: Number(loc.pm2_5)
    };

    let backendResponse;
    try {
      backendResponse = await apiClient.post('/predict', payload);
    } catch (apiErr) {
      const err = new Error('Unable to fetch data');
      err.originalError = apiErr;
      throw err;
    }

    if (!backendResponse || backendResponse.success === false) {
      throw new Error('Unable to fetch data');
    }

    const {
      air_quality: rawAirQuality,
      confidence,
      feature_extraction,
      pollution_pattern,
      pollution_score,
      recommendations
    } = backendResponse;

    // Compute AQI scale representation directly from measured particulate and regression pollution score
    const calculatedAQI = Math.round(loc.pm2_5 * 2.1 + (pollution_score || 0) * 100);

    // Multi-factor category classification based on regression score, particulate metrics, and backend response
    const meta = getCategoryMeta(rawAirQuality, calculatedAQI, loc.pm2_5, pollution_score);

    const recommendationsList = [
      meta.advice,
      ...(Array.isArray(recommendations) && recommendations.length > 0 ? recommendations.slice(1) : [])
    ];

    const result = {
      name: loc.name,
      country: loc.country,
      region: loc.state,
      lat: loc.lat,
      lng: loc.lng,
      aqi: calculatedAQI,
      category: meta.category,
      categoryColor: meta.categoryColor,
      mainConcern: meta.mainConcern,
      shortAdvice: meta.advice,
      recommendation: recommendationsList.join(' '),
      rawPayload: payload,
      backendML: {
        airQuality: meta.category,
        confidence: confidence ?? 100.0,
        featureExtraction: feature_extraction || { PC1: 0, PC2: 0 },
        pollutionPattern: pollution_pattern ?? 0,
        pollutionScore: pollution_score ?? 0,
        recommendations: recommendationsList
      },
      pollutants: [
        { name: "PM2.5", label: "Fine Particles (PM2.5)", value: loc.pm2_5, unit: "µg/m³", limit: 30, status: loc.pm2_5 > 60 ? "Critical" : loc.pm2_5 > 30 ? "Moderate" : "Good" },
        { name: "PM10 / RSPM", label: "Coarse Dust (RSPM)", value: loc.rspm, unit: "µg/m³", limit: 60, status: loc.rspm > 100 ? "Critical" : loc.rspm > 60 ? "Moderate" : "Good" },
        { name: "SPM", label: "Suspended Particulate", value: loc.spm, unit: "µg/m³", limit: 100, status: loc.spm > 200 ? "High" : loc.spm > 100 ? "Moderate" : "Good" },
        { name: "NO2", label: "Nitrogen Dioxide", value: loc.no2, unit: "ppb", limit: 40, status: loc.no2 > 40 ? "Moderate" : "Good" },
        { name: "SO2", label: "Sulfur Dioxide", value: loc.so2, unit: "ppb", limit: 20, status: loc.so2 > 20 ? "Moderate" : "Good" }
      ]
    };

    // Save valid search to history & MongoDB persistence
    airQualityService.saveHistory({
      location: result.name,
      country: result.country,
      aqi: result.aqi,
      category: result.category,
      categoryColor: result.categoryColor,
      mainConcern: result.mainConcern,
      timestamp: new Date().toISOString()
    });

    return result;
  },

  // Search History
  getHistory: () => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  saveHistory: (entry) => {
    try {
      const history = airQualityService.getHistory();
      const filtered = history.filter(h => h.location.toLowerCase() !== entry.location.toLowerCase());
      const updated = [{ id: 'h_' + Date.now(), ...entry }, ...filtered].slice(0, 30);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      mongoService.insertDocument('search_history', entry);
      return updated;
    } catch (e) {
      return [];
    }
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_KEY);
    mongoService.clearCollection('search_history');
    return [];
  },

  // Favorites
  getFavorites: () => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return ['Coimbatore', 'Delhi', 'Bengaluru', 'Shimla', 'Mumbai'];
  },

  toggleFavorite: (cityName) => {
    const favs = airQualityService.getFavorites();
    const exists = favs.some(f => f.toLowerCase() === cityName.toLowerCase());
    let updated;
    if (exists) {
      updated = favs.filter(f => f.toLowerCase() !== cityName.toLowerCase());
    } else {
      updated = [...favs, cityName];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    mongoService.insertDocument('favorites', { cityName, isFavorite: !exists });
    return updated;
  },

  isFavorite: (cityName) => {
    const favs = airQualityService.getFavorites();
    return favs.some(f => f.toLowerCase() === (cityName || '').toLowerCase());
  }
};
