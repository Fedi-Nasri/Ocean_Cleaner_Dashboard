
import { useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapNavigation = () => {
  const [selectedAreas, setSelectedAreas] = useState<any[]>([]);

  const handleCreated = (e: any) => {
    const { layerType, layer } = e;
    
    if (layerType === 'polygon') {
      const coordinates = layer.getLatLngs()[0].map((latlng: L.LatLng) => [
        latlng.lat,
        latlng.lng,
      ]);
      
      console.log('Selected Area Coordinates:', coordinates);
      setSelectedAreas([...selectedAreas, coordinates]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-ocean-800 mb-4">Map Area Selection</h1>
        
        <div className="h-[70vh] border border-gray-300 rounded-lg overflow-hidden">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <FeatureGroup>
              <EditControl
                position="topright"
                onCreated={handleCreated}
                draw={{
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false,
                }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>
        
        {selectedAreas.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h2 className="font-medium mb-2">Selected Areas:</h2>
            <p className="text-sm text-gray-600">
              {selectedAreas.length} area{selectedAreas.length !== 1 && 's'} selected
              (check console for coordinates)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapNavigation;
