import { MapPin, UtensilsCrossed, Type } from 'lucide-react';
import type { FoodPlace } from '../types';

interface PlaceCardProps {
  place: FoodPlace;
  onClick: () => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h3 className="text-lg font-semibold mb-2">{place.name}</h3>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4" />
          <span>{place.foodItems.join(', ')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          <span>{place.type}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{place.address}</span>
        </div>
      </div>
    </div>
  );
}