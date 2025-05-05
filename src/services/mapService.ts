
import { database } from "@/lib/firebase";
import { ref, set, get, remove, onValue } from "firebase/database";

export interface MapArea {
  id: string;
  name: string;
  coordinates: [number, number][];
  createdAt: number;
}

export interface MapData {
  id: string;
  name: string;
  areas: MapArea[];
  createdAt: number;
}

// Save a map to Firebase
export const saveMap = async (map: MapData): Promise<void> => {
  const mapRef = ref(database, `maps/${map.id}`);
  await set(mapRef, map);
};

// Get all maps from Firebase
export const getMaps = async (): Promise<MapData[]> => {
  const mapsRef = ref(database, 'maps');
  const snapshot = await get(mapsRef);
  
  if (snapshot.exists()) {
    return Object.values(snapshot.val()) as MapData[];
  }
  
  return [];
};

// Get a specific map from Firebase
export const getMap = async (id: string): Promise<MapData | null> => {
  const mapRef = ref(database, `maps/${id}`);
  const snapshot = await get(mapRef);
  
  if (snapshot.exists()) {
    return snapshot.val() as MapData;
  }
  
  return null;
};

// Delete a map from Firebase
export const deleteMap = async (id: string): Promise<void> => {
  const mapRef = ref(database, `maps/${id}`);
  await remove(mapRef);
};

// Add a real-time listener for robot position
export const listenToRobotPosition = (callback: (position: [number, number]) => void): () => void => {
  const positionRef = ref(database, 'robotPosition');
  
  const unsubscribe = onValue(positionRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as [number, number]);
    }
  });
  
  return unsubscribe;
};
