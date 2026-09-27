import apiClient from './api';
import { getCategoryMeta } from './airQualityService';

export const predictionService = {
  // Invokes deployed Random Forest & ML pipeline endpoint on Render
  runPrediction: async (inputs) => {
    const payload = {
      so2: parseFloat(inputs.so2),
      no2: parseFloat(inputs.no2),
      rspm: parseFloat(inputs.rspm),
      spm: parseFloat(inputs.spm),
      pm2_5: parseFloat(inputs.pm2_5)
    };

    if (isNaN(payload.so2) || isNaN(payload.no2) || isNaN(payload.rspm) || isNaN(payload.spm) || isNaN(payload.pm2_5)) {
      throw new Error('Please provide valid numerical values for all pollutant metrics.');
    }

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
      air_quality,
      confidence,
      feature_extraction,
      pollution_pattern,
      pollution_score,
      recommendations
    } = backendResult;

    if (!air_quality) {
      throw new Error('Unable to fetch data');
    }

    const meta = getCategoryMeta(air_quality);
    const recommendationsList = Array.isArray(recommendations) && recommendations.length > 0
      ? recommendations
      : ["Air quality evaluated by backend ML model."];

    return {
      predictedClass: air_quality,
      predictedColor: meta.categoryColor,
      confidence: confidence ?? 100.0,
      pollutionScore: pollution_score ?? 0,
      pollutionPattern: pollution_pattern ?? 0,
      pcaProjection: feature_extraction || { PC1: 0, PC2: 0 },
      explanation: `Classification model evaluated ${air_quality} rating with ${confidence ?? 100}% confidence. Regression pollution score: ${pollution_score}. Pattern index: #${pollution_pattern}.`,
      recommendation: recommendationsList.join(' '),
      recommendations: recommendationsList,
      featureImportances: [
        { feature: "Fine Particulate (PM2.5)", weight: 42, color: "#06B6D4" },
        { feature: "Coarse Particulate (RSPM)", weight: 26, color: "#14B8A6" },
        { feature: "Nitrogen Dioxide (NO2)", weight: 16, color: "#38BDF8" },
        { feature: "Sulfur Dioxide (SO2)", weight: 11, color: "#10B981" },
        { feature: "Suspended Particulate (SPM)", weight: 5, color: "#F59E0B" }
      ]
    };
  }
};
