import React, { createContext, useContext, useState, useEffect } from 'react';
import { airQualityService } from '../services/airQualityService';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState('Coimbatore');
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchAirData = (locationName) => {
    setLoading(true);
    setError(null);
    airQualityService.getAirQuality(locationName)
      .then((data) => {
        setAirData(data);
        setHistory(airQualityService.getHistory());
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch environmental telemetry from Render backend.');
        setLoading(false);
      });
  };

  // Load favorites & history on mount
  useEffect(() => {
    setFavorites(airQualityService.getFavorites());
    setHistory(airQualityService.getHistory());
  }, []);

  // Fetch air data when selected location changes
  useEffect(() => {
    fetchAirData(selectedLocation);
  }, [selectedLocation]);

  const selectLocation = (loc) => {
    if (loc && loc.trim()) {
      setSelectedLocation(loc.trim());
    }
  };

  const toggleFavorite = (loc) => {
    const updated = airQualityService.toggleFavorite(loc);
    setFavorites(updated);
    return updated;
  };

  const isFavorite = (loc) => {
    return favorites.some(f => f.toLowerCase() === (loc || '').toLowerCase());
  };

  const clearHistory = () => {
    airQualityService.clearHistory();
    setHistory([]);
  };

  const refetch = () => {
    fetchAirData(selectedLocation);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        airData,
        loading,
        error,
        favorites,
        history,
        selectLocation,
        toggleFavorite,
        isFavorite,
        clearHistory,
        refetch
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocationContext must be used within LocationProvider');
  return context;
};
