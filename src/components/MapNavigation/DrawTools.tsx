
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";

interface DrawToolsProps {
  onAreaCreated: (e: any) => void;
}

const DrawTools = ({ onAreaCreated }: DrawToolsProps) => {
  const map = useMap();
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  
  useEffect(() => {
    if (!map) return;
    
    try {
      // Initialize FeatureGroup for the editable layers
      const featureGroup = new L.FeatureGroup();
      map.addLayer(featureGroup);
      featureGroupRef.current = featureGroup;
      
      // Check if L.Control.Draw exists
      if (typeof L.Control === 'object' && 'Draw' in L.Control) {
        // Initialize the draw control and pass it the FeatureGroup
        const drawControl = new (L.Control as any).Draw({
          edit: {
            featureGroup: featureGroup,
            poly: {
              allowIntersection: false
            },
          },
          draw: {
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: {
              allowIntersection: false,
              showArea: true,
              showLength: true,
              metric: true,
              precision: {
                km: 2,
                m: 2,
                cm: 2,
                mi: 2,
                ft: 2
              },
              // Allow for flexible polygon creation
              repeatMode: false,
              // Remove restrictions on number of points
              minVertexCount: 3,
              maxVertexCount: Infinity
            }
          }
        });
        
        map.addControl(drawControl);
        
        // Handle draw created event
        const drawEventName = (L as any).Draw?.Event?.CREATED || 'draw:created';
        map.on(drawEventName, (e: any) => {
          const layer = e.layer;
          featureGroup.addLayer(layer);
          
          // Pass the event to parent component
          onAreaCreated(e);
        });
        
        return () => {
          // Cleanup
          map.off(drawEventName);
          if (drawControl) {
            map.removeControl(drawControl);
          }
          map.removeLayer(featureGroup);
        };
      } else {
        console.error("Leaflet Draw Control is not available");
        return;
      }
    } catch (error) {
      console.error("Error initializing Leaflet Draw:", error);
    }
  }, [map, onAreaCreated]);
  
  return null;
};

export default DrawTools;
