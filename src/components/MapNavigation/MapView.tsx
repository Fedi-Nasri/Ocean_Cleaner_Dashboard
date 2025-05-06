
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { NavigationMap, MapArea } from "@/hooks/useMapNavigation";
import DrawTools from "./DrawTools";
import L from "leaflet";

interface MapViewProps {
  isEditing: boolean;
  currentMap: NavigationMap | null;
  handleAreaCreated: (e: any) => void;
}

const MapView = ({ isEditing, currentMap, handleAreaCreated }: MapViewProps) => {
  // Default to a central location if no map is selected
  const defaultCenter: [number, number] = [51.505, -0.09];
  const mapRef = useRef<L.Map>(null);
  
  // Set the map view to fit all areas when the map changes
  useEffect(() => {
    if (currentMap && currentMap.areas.length > 0 && mapRef.current) {
      try {
        const allPoints: L.LatLngExpression[] = [];
        currentMap.areas.forEach(area => {
          area.coordinates.forEach(polygon => {
            polygon.forEach(coord => {
              // Make sure each coordinate is a valid LatLng tuple [number, number]
              if (coord.length === 2) {
                allPoints.push([coord[0], coord[1]] as [number, number]);
              }
            });
          });
        });
        
        if (allPoints.length > 0) {
          const bounds = L.latLngBounds(allPoints);
          mapRef.current.fitBounds(bounds);
        }
      } catch (error) {
        console.error("Error fitting map to bounds:", error);
      }
    }
  }, [currentMap]);

  return (
    <div className="flex-grow relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {isEditing && (
          <DrawTools 
            onAreaCreated={handleAreaCreated}
          />
        )}
        
        {currentMap?.areas.map((area: MapArea) => (
          area.coordinates.map((polygon, polygonIndex) => (
            <Polygon 
              key={`${area.id}-${polygonIndex}`}
              positions={polygon as [number, number][]}
              pathOptions={{ 
                color: '#0EA5E9', 
                fillColor: '#0EA5E9', 
                fillOpacity: 0.2,
                weight: 3
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-medium">{area.name}</h3>
                  <p className="text-xs text-gray-500">
                    {polygon.length} points
                  </p>
                </div>
              </Popup>
            </Polygon>
          ))
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
