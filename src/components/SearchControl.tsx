import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Extend the Leaflet map type to include geosearch methods
declare module 'leaflet' {
  interface Map {
    addControl(control: any): this;
    removeControl(control: any): this;
  }
}

interface SearchControlProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

export function SearchControl({ onLocationSelect }: SearchControlProps) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: {
        'accept-language': 'en',
        countrycodes: 'np',
      },
    });

    const searchControl = GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Search places in Nepal',
    }) as L.Control;

    map.addControl(searchControl);

    const handleLocationFound = (event: any) => {
      if (event.location) {
        onLocationSelect?.(event.location.y, event.location.x);
      }
    };

    map.on('geosearch/showlocation', handleLocationFound as L.LeafletEventHandlerFn);

    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation', handleLocationFound as L.LeafletEventHandlerFn);
    };
  }, [map, onLocationSelect]);

  return null;
}