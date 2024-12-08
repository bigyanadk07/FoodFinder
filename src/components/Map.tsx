import { useEffect, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap, 
  useMapEvents 
} from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { SearchControl } from './SearchControl';
import 'leaflet/dist/leaflet.css';

// Lalitpur, Nepal coordinates
const LALITPUR_CENTER: LatLngExpression = [27.6588, 85.3247];

interface MapPlace {
  id?: string;
  coordinates: { lat: number; lng: number };
  markerColor: string;
  name: string;
  address?: string;
}

interface MapProps {
  center?: LatLngExpression;
  marker?: LatLngExpression;
  markerColor?: string;
  onMarkerChange?: (lat: number, lng: number) => void;
  places?: MapPlace[];
  interactive?: boolean;
  zoomLevel?: number;
}

export function Map({ 
  center = LALITPUR_CENTER, 
  marker, 
  markerColor = '#3B82F6', 
  onMarkerChange, 
  places = [], 
  interactive = true,
  zoomLevel = 13
}: MapProps) {
  // Custom hook for map interactions (moved inside the component)
  const MapInteractions = () => {
    useMapEvents({
      click: interactive && onMarkerChange 
        ? (e) => {
            onMarkerChange(e.latlng.lat, e.latlng.lng);
          }
        : () => {}
    });

    return null;
  };

  // Create a custom marker icon
  const createColoredIcon = (color: string, size = 24) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        " 
        class="hover:scale-110"
        ></div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  };

  // Map center controller
  const MapController = ({ 
    center, 
    zoomLevel = 13 
  }: { 
    center?: LatLngExpression, 
    zoomLevel?: number 
  }) => {
    const map = useMap();

    useEffect(() => {
      if (center) {
        map.setView(center, zoomLevel);
      }
    }, [center, map, zoomLevel]);

    return null;
  };

  // Memoize markers to prevent unnecessary re-renders
  const placesMarkers = useMemo(() => 
    places.map((place, index) => (
      <Marker
        key={place.id || index}
        position={[place.coordinates.lat, place.coordinates.lng]}
        icon={createColoredIcon(place.markerColor)}
        title={place.name}
      >
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">{place.name}</h3>
            {place.address && (
              <p className="text-sm text-gray-600">{place.address}</p>
            )}
          </div>
        </Popup>
      </Marker>
    )), 
    [places]
  );

  return (
    <div className="relative w-full">
      <MapContainer
        center={center}
        zoom={zoomLevel}
        className="h-[600px] w-full rounded-lg z-0"
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="filter brightness-95" // Slight filter to make map look cleaner
        />
        
        {/* Search Control */}
        <SearchControl onLocationSelect={onMarkerChange} />
        
        {/* Custom Markers */}
        {marker && (
          <Marker 
            position={marker} 
            icon={createColoredIcon(markerColor, 30)} 
          />
        )}
        
        {/* Places Markers */}
        {placesMarkers}
        
        {/* Map Interactions */}
        <MapInteractions />
        
        {/* Map Controller */}
        <MapController 
          center={center} 
          zoomLevel={zoomLevel} 
        />
      </MapContainer>
    </div>
  );
}

// Preset map styles (optional, can be used as props or in a style selector)
export const MAP_STYLES = {
  default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  terrain: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};