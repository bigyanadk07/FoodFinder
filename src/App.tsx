import { useState } from 'react';
import Navbar from './components/Navbar';
import { AddPlaceForm } from './components/AddPlaceForm';
import { PlaceCard } from './components/PlaceCard';
import { Map } from './components/Map';
import { PlaceModal } from './components/PlaceModal';
import { Trash2 } from 'lucide-react';
import { usePlaces } from './hooks/usePlaces';
import type { FoodPlace } from './types';



const LALITPUR_CENTER: [number, number] = [27.6588, 85.3247];

function App() {
  const { places, isLoading, error, addPlace, deletePlace } = usePlaces();
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<FoodPlace | null>(null);

  const handleAddPlace = async (place: FoodPlace) => {
    try {
      await addPlace(place);
      setIsAddingPlace(false);
    } catch (err) {
      console.error('Failed to add place:', err);
    }
  };

  const handleDeletePlace = async (id: string) => {
    try {
      await deletePlace(id);
      if (selectedPlace?.id === id) {
        setSelectedPlace(null);
      }
    } catch (err) {
      console.error('Failed to delete place:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading places...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        onAddPlace={() => setIsAddingPlace(true)} 
        placesCount={places.length}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isAddingPlace && (
          <div className="mb-6 bg-white rounded-lg shadow p-6 relative">
            <AddPlaceForm onSubmit={handleAddPlace} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {places.map(place => (
              <div key={place.id} className="relative">
                <PlaceCard 
                  place={place} 
                  onClick={() => setSelectedPlace(place)} 
                />
                <button
                  onClick={() => handleDeletePlace(place.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete place"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {places.length === 0 && !isAddingPlace && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">No places added yet. Add your first food place!</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                    <Map
            center={LALITPUR_CENTER}
            places={places.map(place => ({
              coordinates: place.coordinates,
              markerColor: place.markerColor || '#FF0000', // Provide a default color if undefined
              name: place.name,
            }))}
          />
          </div>
        </div>

        <PlaceModal 
          place={selectedPlace} 
          onClose={() => setSelectedPlace(null)} 
        />
      </main>
    </div>
  );
}

export default App;