import { FoodPlace } from '../types';

const STORAGE_FILE = 'food-places.json';

export async function savePlaces(places: FoodPlace[]): Promise<void> {
  try {
    const data = JSON.stringify(places, null, 2);
    await window.localStorage.setItem(STORAGE_FILE, data);
  } catch (error) {
    console.error('Error saving places:', error);
    throw new Error('Failed to save places');
  }
}

export async function loadPlaces(): Promise<FoodPlace[]> {
  try {
    const data = window.localStorage.getItem(STORAGE_FILE);
    if (!data) return [];
    
    const places = JSON.parse(data);
    return places.map((place: any) => ({
      ...place,
      createdAt: new Date(place.createdAt),
    }));
  } catch (error) {
    console.error('Error loading places:', error);
    return [];
  }
}