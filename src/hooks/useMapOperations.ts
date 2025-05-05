
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { MapData, MapArea, getMaps, saveMap, deleteMap } from "@/services/mapService";

export const useMapOperations = () => {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [currentMap, setCurrentMap] = useState<MapData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mapName, setMapName] = useState("");

  // Load maps on component mount
  useEffect(() => {
    const loadMaps = async () => {
      try {
        const allMaps = await getMaps();
        setMaps(allMaps);
        
        if (allMaps.length > 0 && !selectedMapId) {
          setSelectedMapId(allMaps[0].id);
        }
      } catch (error) {
        console.error("Error loading maps:", error);
        toast.error("Failed to load maps");
      }
    };
    
    loadMaps();
  }, []);
  
  // Update current map when selection changes
  useEffect(() => {
    if (selectedMapId) {
      const map = maps.find(m => m.id === selectedMapId) || null;
      setCurrentMap(map);
      setMapName(map?.name || "");
    } else {
      setCurrentMap(null);
      setMapName("");
    }
  }, [selectedMapId, maps]);
  
  // Create a new map
  const handleCreateMap = () => {
    const newMap: MapData = {
      id: uuidv4(),
      name: "Untitled Map",
      areas: [],
      createdAt: Date.now()
    };
    
    setMaps([...maps, newMap]);
    setSelectedMapId(newMap.id);
    setIsEditing(true);
    setMapName("Untitled Map");
  };
  
  // Delete a map
  const handleDeleteMap = async (id: string) => {
    try {
      await deleteMap(id);
      setMaps(maps.filter(m => m.id !== id));
      
      if (selectedMapId === id) {
        setSelectedMapId(maps.length > 1 ? maps[0].id : null);
      }
      
      toast.success("Map deleted successfully");
    } catch (error) {
      console.error("Error deleting map:", error);
      toast.error("Failed to delete map");
    }
  };
  
  // Enter edit mode for a map
  const handleEditMap = (id: string) => {
    setSelectedMapId(id);
    setIsEditing(true);
  };
  
  // Save the current map
  const handleSaveMap = async () => {
    if (!currentMap) return;
    
    try {
      const updatedMap = {
        ...currentMap,
        name: mapName
      };
      
      await saveMap(updatedMap);
      
      setMaps(maps.map(m => m.id === updatedMap.id ? updatedMap : m));
      setIsEditing(false);
      
      toast.success("Map saved successfully");
    } catch (error) {
      console.error("Error saving map:", error);
      toast.error("Failed to save map");
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    
    if (currentMap) {
      setMapName(currentMap.name);
    }
  };
  
  // Handle area creation
  const handleAreaCreated = (e: any) => {
    if (!currentMap) return;
    
    const layer = e.layer;
    const coordinates = layer.getLatLngs()[0].map((latlng: L.LatLng) => [
      latlng.lat,
      latlng.lng
    ]) as [number, number][];
    
    const newArea: MapArea = {
      id: uuidv4(),
      name: `Area ${currentMap.areas.length + 1}`,
      coordinates,
      createdAt: Date.now()
    };
    
    const updatedMap = {
      ...currentMap,
      areas: [...currentMap.areas, newArea]
    };
    
    setCurrentMap(updatedMap);
    setMaps(maps.map(m => m.id === updatedMap.id ? updatedMap : m));
  };
  
  // Handle area deletion
  const handleAreaDeleted = (e: any) => {
    if (!currentMap) return;
    
    const layers = e.layers;
    const deletedLayers: L.Layer[] = [];
    
    layers.eachLayer((layer: L.Layer) => {
      deletedLayers.push(layer);
    });
    
    // This is a simplified approach - in a real app, you'd want to match layers to areas more reliably
    const remainingAreas = currentMap.areas.filter((_, index) => {
      return index >= currentMap.areas.length - deletedLayers.length;
    });
    
    const updatedMap = {
      ...currentMap,
      areas: remainingAreas
    };
    
    setCurrentMap(updatedMap);
    setMaps(maps.map(m => m.id === updatedMap.id ? updatedMap : m));
  };

  return {
    maps,
    selectedMapId,
    currentMap,
    isEditing,
    mapName,
    setSelectedMapId,
    setMapName,
    setIsEditing,
    handleCreateMap,
    handleDeleteMap,
    handleEditMap,
    handleSaveMap,
    handleCancelEdit,
    handleAreaCreated,
    handleAreaDeleted
  };
};
