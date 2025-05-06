
declare module 'react-leaflet-draw' {
  import { FC } from 'react';
  import L from 'leaflet';

  interface EditControlProps {
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    draw?: {
      polyline?: boolean | L.DrawOptions.PolylineOptions;
      polygon?: boolean | L.DrawOptions.PolygonOptions;
      rectangle?: boolean | L.DrawOptions.RectangleOptions;
      circle?: boolean | L.DrawOptions.CircleOptions;
      marker?: boolean | L.DrawOptions.MarkerOptions;
      circlemarker?: boolean | L.DrawOptions.CircleMarkerOptions;
    };
    edit?: {
      edit?: boolean;
      remove?: boolean;
      poly?: L.EditPolyOptions;
      allowIntersection?: boolean;
    };
    onCreated?: (e: any) => void;
    onEdited?: (e: any) => void;
    onDeleted?: (e: any) => void;
    onMounted?: (drawControl: any) => void;
    onEditStart?: (e: any) => void;
    onEditStop?: (e: any) => void;
    onDeleteStart?: (e: any) => void;
    onDeleteStop?: (e: any) => void;
    onDrawStart?: (e: any) => void;
    onDrawStop?: (e: any) => void;
  }

  export const EditControl: FC<EditControlProps>;
}
