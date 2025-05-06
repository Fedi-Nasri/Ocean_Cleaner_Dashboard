
// Type definitions for leaflet-draw
declare module 'leaflet-draw' {
  import * as L from 'leaflet';
  
  namespace L {
    namespace Draw {
      class Event {
        static CREATED: string;
        static EDITED: string;
        static DELETED: string;
        static DRAWSTART: string;
        static DRAWSTOP: string;
        static DRAWVERTEX: string;
        static EDITSTART: string;
        static EDITSTOP: string;
        static DELETESTART: string;
        static DELETESTOP: string;
      }
    }

    namespace Control {
      class Draw extends L.Control {
        constructor(options?: DrawConstructorOptions);
        enable(): void;
        disable(): void;
      }

      interface DrawConstructorOptions {
        edit?: EditOptions;
        draw?: DrawOptions;
      }
    }
  }

  interface EditOptions {
    featureGroup: L.FeatureGroup;
    poly?: {
      allowIntersection?: boolean;
    };
  }

  interface DrawOptions {
    polyline?: any;
    polygon?: PolygonOptions;
    rectangle?: any;
    circle?: any;
    marker?: any;
    circlemarker?: any;
  }

  interface PolygonOptions {
    allowIntersection?: boolean;
    showArea?: boolean;
    showLength?: boolean;
    metric?: boolean;
    precision?: {
      km?: number;
      m?: number;
      cm?: number;
      mi?: number;
      ft?: number;
    };
    repeatMode?: boolean;
    minVertexCount?: number;
    maxVertexCount?: number;
  }
}

// Type definitions for leaflet-draw CSS
declare module 'leaflet-draw/dist/leaflet.draw.css' {
  const content: any;
  export default content;
}
