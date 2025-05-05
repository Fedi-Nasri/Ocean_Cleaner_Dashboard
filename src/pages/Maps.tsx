import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup, FeatureGroup, useMap } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Map as MapIcon, Plus, Edit, Trash2 } from "lucide-react";
import { MapArea, MapData, getMaps, saveMap, deleteMap } from "@/services/mapService";
import { v4 as uuidv4 } from "uuid";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Fix Leaflet icon issues
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet-draw";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom EditControl component that uses Leaflet Draw directly
const DrawTools = ({ onCreate, onDelete }) => {
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

// Rest of the file with MapSidebar and Maps components
const MapSidebar = ({ 
  maps, 
  selectedMap, 
  onMapSelect, 
  onCreateMap, 
  onDeleteMap, 
  onEditMap 
}: { 
  maps: MapData[];
  selectedMap: string | null;
  onMapSelect: (id: string) => void;
  onCreateMap: () => void;
  onDeleteMap: (id: string) => void;
  onEditMap: (id: string) => void;
}) => {
  return (
    <div className="w-72 border-l border-ocean-100 bg-white h-full overflow-auto">
      <div className="p-4 border-b border-ocean-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ocean-800">Saved Maps</h2>
          <Button onClick={onCreateMap} size="sm" className="bg-ocean-600 hover:bg-ocean-700">
            <Plus className="h-4 w-4 mr-1" />
            New Map
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {maps.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MapIcon className="mx-auto h-10 w-10 mb-2 text-ocean-300" />
            <p>No maps created yet</p>
            <p className="text-xs">Click "New Map" to create one</p>
          </div>
        ) : (
          maps.map((map) => (
            <Card 
              key={map.id} 
              className={`cursor-pointer hover:border-ocean-300 transition-colors ${selectedMap === map.id ? 'border-ocean-500 bg-ocean-50' : ''}`}
              onClick={() => onMapSelect(map.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{map.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {map.areas.length} area{map.areas.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMap(map.id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive hover:text-destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMap(map.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const Maps = () => {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [currentMap, setCurrentMap] = useState<MapData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mapName, setMapName] = useState("");
  
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  
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
  
  const handleEditMap = (id: string) => {
    setSelectedMapId(id);
    setIsEditing(true);
  };
  
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
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    
    if (currentMap) {
      setMapName(currentMap.name);
    }
  };
  
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
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <SidebarInset className="bg-gradient-to-br from-ocean-50/50 to-white">
          <div className="flex flex-col min-h-screen">
            <header className="bg-white border-b border-ocean-100 py-4 px-6">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-ocean-800 flex items-center">
                  <MapIcon className="mr-2 h-6 w-6 text-ocean-600" />
                  Maps & Navigation
                </h1>
                
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={mapName}
                      onChange={(e) => setMapName(e.target.value)}
                      placeholder="Map Name"
                      className="w-64"
                    />
                    <Button onClick={handleSaveMap} className="bg-ocean-600 hover:bg-ocean-700">
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  currentMap && (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-ocean-600 hover:bg-ocean-700"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Map
                    </Button>
                  )
                )}
              </div>
            </header>
            
            <main className="flex-grow flex overflow-hidden">
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
                  
                  {currentMap && currentMap.areas.map((area) => (
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
              
              <MapSidebar
                maps={maps}
                selectedMap={selectedMapId}
                onMapSelect={setSelectedMapId}
                onCreateMap={handleCreateMap}
                onDeleteMap={handleDeleteMap}
                onEditMap={handleEditMap}
              />
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Maps;
