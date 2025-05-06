
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { database } from "@/lib/firebase";
import { ref, set, get, remove, onValue } from "firebase/database";

export interface MapArea {
  id: string;
  name: string;
  coordinates: [number, number][][]; // Array of polygon coordinates
  createdAt: number;
}

export interface NavigationMap {
  id: string;
  name: string;
  areas: MapArea[];
  createdAt: number;
}

export const useMapNavigation = () => {
  const [maps, setMaps] = useState<NavigationMap[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [currentMap, setCurrentMap] = useState<NavigationMap | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mapName, setMapName] = useState("");

  // Fetch maps from Firebase
  useEffect(() => {
    const mapsRef = ref(database, 'navigationMaps');
    
    const unsubscribe = onValue(mapsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const mapsArray = Object.values(data) as NavigationMap[];
        setMaps(mapsArray.sort((a, b) => b.createdAt - a.createdAt));
        
        // Select the first map if none is selected
        if (mapsArray.length > 0 && !selectedMapId) {
          setSelectedMapId(mapsArray[0].id);
        }
      } else {
        setMaps([]);
      }
    }, (error) => {
      console.error("Error fetching maps:", error);
      toast.error("Failed to load maps");
    });
    
    return () => unsubscribe();
  }, [selectedMapId]);
  
  // Set current map when selectedMapId changes
  useEffect(() => {
    if (selectedMapId) {
      const map = maps.find(m => m.id === selectedMapId) || null;
      setCurrentMap(map);
      
      if (map) {
        setMapName(map.name);
      }
    } else {
      setCurrentMap(null);
      setMapName("");
    }
  }, [selectedMapId, maps]);
  
  // Create a new map
  const handleCreateMap = useCallback(() => {
    console.log("handleCreateMap called");
    const newMapId = uuidv4();
    const newMap: NavigationMap = {
      id: newMapId,
      name: "New Map",
      areas: [],
      createdAt: Date.now()
    };
    
    const mapRef = ref(database, `navigationMaps/${newMapId}`);
    set(mapRef, newMap)
      .then(() => {
        console.log("New map created with ID:", newMapId);
        setSelectedMapId(newMapId);
        setIsEditing(true);
        setMapName("New Map");
        toast.success("New map created");
      })
      .catch((error) => {
        console.error("Error creating map:", error);
        toast.error("Failed to create map");
      });
  }, []);
  
  // Delete a map
  const handleDeleteMap = useCallback((id: string) => {
    const mapRef = ref(database, `navigationMaps/${id}`);
    remove(mapRef)
      .then(() => {
        if (selectedMapId === id) {
          if (maps.length > 1) {
            // Find the next map to select
            const mapIndex = maps.findIndex(m => m.id === id);
            const nextMap = maps[mapIndex === 0 ? 1 : mapIndex - 1];
            setSelectedMapId(nextMap.id);
          } else {
            setSelectedMapId(null);
          }
        }
        toast.success("Map deleted");
      })
      .catch((error) => {
        console.error("Error deleting map:", error);
        toast.error("Failed to delete map");
      });
  }, [maps, selectedMapId]);
  
  // Edit a map
  const handleEditMap = useCallback((id: string) => {
    const map = maps.find(m => m.id === id);
    if (map) {
      setSelectedMapId(id);
      setIsEditing(true);
    }
  }, [maps]);
  
  // Save map changes
  const handleSaveMap = useCallback(() => {
    if (!currentMap || !mapName.trim()) {
      toast.error("Map name cannot be empty");
      return;
    }
    
    const updatedMap = {
      ...currentMap,
      name: mapName.trim()
    };
    
    const mapRef = ref(database, `navigationMaps/${currentMap.id}`);
    set(mapRef, updatedMap)
      .then(() => {
        setIsEditing(false);
        toast.success("Map saved");
      })
      .catch((error) => {
        console.error("Error saving map:", error);
        toast.error("Failed to save map");
      });
  }, [currentMap, mapName]);
  
  // Cancel edit mode
  const handleCancelEdit = useCallback(() => {
    if (currentMap) {
      setMapName(currentMap.name);
    }
    setIsEditing(false);
  }, [currentMap]);
  
  // Handle area created by drawing on the map
  const handleAreaCreated = useCallback((areaData: any) => {
    if (!currentMap || !isEditing) return;
    
    const layer = areaData.layer;
    
    // Ensure we get an array of [lat, lng] tuples
    const coordinates = layer.getLatLngs()[0].map((latLng: any): [number, number] => 
      [latLng.lat, latLng.lng]
    );
    
    const newArea: MapArea = {
      id: uuidv4(),
      name: `Area ${currentMap.areas.length + 1}`,
      coordinates: [coordinates],
      createdAt: Date.now()
    };
    
    console.log("New area coordinates:", newArea.coordinates);
    
    const updatedMap = {
      ...currentMap,
      areas: [...currentMap.areas, newArea]
    };
    
    const mapRef = ref(database, `navigationMaps/${currentMap.id}`);
    set(mapRef, updatedMap)
      .then(() => {
        toast.success("Area added to map");
      })
      .catch((error) => {
        console.error("Error adding area:", error);
        toast.error("Failed to add area");
      });
  }, [currentMap, isEditing]);
  
  return {
    maps,
    selectedMapId,
    currentMap,
    isEditing,
    mapName,
    setMapName,
    setSelectedMapId,
    setIsEditing,
    handleCreateMap,
    handleDeleteMap,
    handleEditMap,
    handleSaveMap,
    handleCancelEdit,
    handleAreaCreated
  };
};
