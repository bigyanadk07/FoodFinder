import React, { useState, useCallback, useMemo } from 'react';
import { MapPin, UtensilsCrossed, Type, Navigation, StickyNote, AlertCircle, X } from 'lucide-react';
import { Map } from './Map';
import { ColorPicker } from './ColorPicker';

interface Place {
  id: string;
  name: string;
  foodItems: string[];
  type: string;
  address: string;
  notes?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  markerColor: string;
  createdAt: Date;
}

interface AddPlaceFormProps {
  onSubmit: (place: Place) => void;
  onClose?: () => void; // New optional prop for closing the form
}

export function AddPlaceForm({ onSubmit, onClose }: AddPlaceFormProps) {
  const [coordinates, setCoordinates] = useState<[number, number]>([51.505, -0.09]);
  const [markerColor, setMarkerColor] = useState('#3B82F6');
  const [formData, setFormData] = useState({
    name: '',
    foodItems: '',
    type: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  // Validate form data before submission
  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Restaurant name must be at least 2 characters';
    }

    // Food items validation
    if (!formData.foodItems.trim()) {
      newErrors.foodItems = 'At least one food item is required';
    } else {
      const items = formData.foodItems.split(',').map(item => item.trim());
      if (items.some(item => item.length < 2)) {
        newErrors.foodItems = 'Each food item must be at least 2 characters';
      }
    }

    // Type validation
    if (!formData.type.trim()) {
      newErrors.type = 'Place type is required';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Notes are optional, so no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Proceed with submission
    onSubmit({
      ...formData,
      coordinates: {
        lat: coordinates[0],
        lng: coordinates[1],
      },
      foodItems: formData.foodItems.split(',').map(item => item.trim()),
      markerColor,
      createdAt: new Date(),
      id: Date.now().toString(),
    });

    // Reset form
    setFormData({
      name: '',
      foodItems: '',
      type: '',
      address: '',
      notes: '',
    });
    setCoordinates([51.505, -0.09]);
    setMarkerColor('#3B82F6');
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof formData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof formData];
        return newErrors;
      });
    }
  };

  // Memoized error display component
  const ErrorMessage = useMemo(() => {
    return ({ field }: { field: keyof typeof formData }) => {
      const error = errors[field];
      return error ? (
        <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : null;
    };
  }, [errors]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md relative">
      {/* Close button - only render if onClose is provided */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close form"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Place</h2>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <UtensilsCrossed className="h-4 w-4" />
            Restaurant Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          <ErrorMessage field="name" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Type className="h-4 w-4" />
            Food Items (comma-separated)
          </label>
          <input
            type="text"
            name="foodItems"
            value={formData.foodItems}
            onChange={handleChange}
            placeholder="Pizza, Pasta, Salad"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.foodItems ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          <ErrorMessage field="foodItems" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Navigation className="h-4 w-4" />
            Type of Place
          </label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Restaurant, Cafe, Food Truck"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.type ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          <ErrorMessage field="type" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4" />
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Tasty Street, City, Country"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          <ErrorMessage field="address" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <StickyNote className="h-4 w-4" />
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any special details about the place..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Marker Color
          </label>
          <ColorPicker selectedColor={markerColor} onChange={setMarkerColor} />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4" />
            Pin Location
          </label>
          <Map
            center={coordinates}
            marker={coordinates}
            markerColor={markerColor}
            onMarkerChange={(lat, lng) => setCoordinates([lat, lng])}
          />
        </div>
      </div>

      <div className="flex space-x-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out"
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out"
        >
          Save Place
        </button>
      </div>
    </form>
  );
}