import { useState, useEffect, useCallback } from 'react';
import { FoodPlace } from '../types';
import { loadPlaces, savePlaces } from '../utils/storage';

export function usePlaces() {
  const [places, setPlaces] = useState<FoodPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load places on component mount
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const loadedPlaces = await loadPlaces();
        setPlaces(loadedPlaces);
      } catch (err) {
        setError('Failed to load places');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Save places whenever they change
  const addPlace = useCallback(async (place: FoodPlace) => {
    try {
      const newPlaces = [place, ...places];
      await savePlaces(newPlaces);
      setPlaces(newPlaces);
    } catch (err) {
      setError('Failed to save place');
      throw err;
    }
  }, [places]);

  const deletePlace = useCallback(async (id: string) => {
    try {
      const newPlaces = places.filter(place => place.id !== id);
      await savePlaces(newPlaces);
      setPlaces(newPlaces);
    } catch (err) {
      setError('Failed to delete place');
      throw err;
    }
  }, [places]);

  return {
    places,
    isLoading,
    error,
    addPlace,
    deletePlace
  };
}