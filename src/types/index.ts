export type FoodPlace = {
  id: string;
  name: string;
  foodItems: string[];
  type: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  
  notes?: string;
  createdAt: Date;
  markerColor?: string;
};