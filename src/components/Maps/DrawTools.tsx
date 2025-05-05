
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";

// This is needed to fix TypeScript types for leaflet-draw
declare module "leaflet" {
  namespace Control {
    interface DrawOptions {
      position?: string;
      draw?: {
        polyline?: boolean | any;
        polygon?: boolean | any;
        rectangle?: boolean | any;
        circle?: boolean | any;
        marker?: boolean | any;
        circlemarker?: boolean | any;
      };
      edit?: {
        featureGroup?: L.FeatureGroup;
        poly?: any;
        remove?: boolean;
      };
    }
    
    class Draw extends L.Control {
      constructor(options?: DrawOptions);
    }
  }
  
  namespace Draw {
    namespace Event {
      const CREATED: string;
      const EDITED: string;
      const DELETED: string;
      const DRAWSTART: string;
      const DRAWSTOP: string;
      const DRAWVERTEX: string;
      const EDITSTART: string;
      const EDITMOVE: string;
      const EDITRESIZE: string;
      const EDITVERTEX: string;
      const EDITSTOP: string;
      const DELETESTART: string;
      const DELETESTOP: string;
    }
  }
}

interface DrawToolsProps {
  onCreate: (e: any) => void;
  onDelete: (e: any) => void;
}

const DrawTools = ({ onCreate, onDelete }: DrawToolsProps) => {
  const map = useMap();
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  
  useEffect(() => {
    if (!map) return;
    
    // Initialize FeatureGroup for the editable layers
    const featureGroup = new L.FeatureGroup();
    map.addLayer(featureGroup);
    featureGroupRef.current = featureGroup;
    
    // Initialize the draw control and pass it the FeatureGroup
    const drawControl = new L.Control.Draw({
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
          showArea: true
        }
      }
    });
    map.addControl(drawControl);
    
    // Handle draw created event
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      featureGroup.addLayer(layer);
      if (onCreate) onCreate(e);
    });
    
    // Handle draw deleted event
    map.on(L.Draw.Event.DELETED, (e: any) => {
      if (onDelete) onDelete(e);
    });
    
    return () => {
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.DELETED);
      map.removeControl(drawControl);
      map.removeLayer(featureGroup);
    };
  }, [map, onCreate, onDelete]);
  
  return null;
};

export default DrawTools;
