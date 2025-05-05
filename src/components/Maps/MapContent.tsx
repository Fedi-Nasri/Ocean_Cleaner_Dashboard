
import { useRef } from "react";
import { MapContainer, TileLayer, Polygon, Popup, FeatureGroup } from "react-leaflet";
import DrawTools from "./DrawTools";
import { MapData, MapArea } from "@/services/mapService";

interface MapContentProps {
  isEditing: boolean;
  currentMap: MapData | null;
  handleAreaCreated: (e: any) => void;
  handleAreaDeleted: (e: any) => void;
}

const MapContent = ({ 
  isEditing, 
  currentMap, 
  handleAreaCreated, 
  handleAreaDeleted 
}: MapContentProps) => {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  return (
    <div className="flex-grow relative">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {isEditing && (
          <DrawTools 
            onCreate={handleAreaCreated} 
            onDelete={handleAreaDeleted} 
          />
        )}
        
        {currentMap && currentMap.areas.map((area: MapArea) => (
          <Polygon 
            key={area.id}
            positions={area.coordinates}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
          >
            <Popup>
              <div>
                <h3 className="font-medium">{area.name}</h3>
                <p className="text-xs">
                  {area.coordinates.length} points
                </p>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapContent;
