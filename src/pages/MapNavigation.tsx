
import { useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import MapHeader from "@/components/MapNavigation/MapHeader";
// import { database } from "@/lib/firebase";
// import { ref, push, set } from "firebase/database";

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapNavigation = () => {
  const [selectedAreas, setSelectedAreas] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mapName, setMapName] = useState<string>("New Map");

  // Override the default polygon style to use a darker blue
  const drawOptions = {
    polygon: {
      shapeOptions: {
        color: '#0FA0CE', // Border color
        fillColor: '#0FA0CE', // Fill color - darker blue
        fillOpacity: 0.3,
        weight: 2
      }
    },
    rectangle: false,
    circle: false,
    circlemarker: false,
    marker: false,
    polyline: false,
  };

  const handleCreated = (e: any) => {
    const { layerType, layer } = e;
    
    if (layerType === 'polygon') {
      const coordinates = layer.getLatLngs()[0].map((latlng: L.LatLng) => [
        latlng.lat,
        latlng.lng,
      ]);
      
      console.log('Selected Area Coordinates:', coordinates);
      setSelectedAreas([...selectedAreas, coordinates]);
    }
  };

  const handleSendMap = () => {
    if (selectedAreas.length === 0) {
      console.log("No areas selected. Please draw at least one polygon on the map.");
      return;
    }

    // Prepare the data to be sent
    const mapData = {
      id: crypto.randomUUID(),
      name: mapName,
      areas: selectedAreas.map((coordinates, index) => ({
        id: crypto.randomUUID(),
        name: `Area ${index + 1}`,
        coordinates,
        createdAt: Date.now()
      })),
      createdAt: Date.now()
    };

    console.log("Map data ready to be sent:", mapData);

    // Commented Firebase code that would send the data
    /* 
    // Create a reference to the maps collection
    const mapsRef = ref(database, 'maps');
    // Generate a new unique ID for this map
    const newMapRef = push(mapsRef);
    // Set the data under this new ID
    set(newMapRef, mapData)
      .then(() => {
        console.log("Map data successfully sent to Firebase!");
        // Reset the form or provide user feedback here
      })
      .catch((error) => {
        console.error("Error sending map data to Firebase:", error);
      });
    */
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveMap = () => {
    console.log("Map saved with name:", mapName);
    setIsEditing(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold text-ocean-800 px-2 py-1">Map Navigation</h2>
          </SidebarHeader>
          <SidebarContent>
            <div className="p-2">
              <Button 
                onClick={handleSendMap} 
                className="w-full bg-ocean-600 hover:bg-ocean-700 mb-4"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Map
              </Button>
              
              {selectedAreas.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Selected Areas:</h3>
                  <p className="text-sm text-gray-600">
                    {selectedAreas.length} area{selectedAreas.length !== 1 && 's'} selected
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full" 
                    onClick={() => console.log(JSON.stringify(selectedAreas, null, 2))}
                  >
                    View Details
                  </Button>
                </div>
              )}
            </div>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <MapHeader 
            isEditing={isEditing} 
            mapName={mapName} 
            currentMap={selectedAreas.length > 0 ? { name: mapName } : null} 
            setMapName={setMapName}
            handleSaveMap={handleSaveMap}
            handleCancelEdit={handleCancelEdit}
            setIsEditing={setIsEditing}
          />
          
          <div className="p-4">
            <div className="h-[calc(100vh-10rem)] border border-gray-300 rounded-lg overflow-hidden">
              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <FeatureGroup>
                  <EditControl
                    position="topright"
                    onCreated={handleCreated}
                    draw={drawOptions}
                  />
                </FeatureGroup>
              </MapContainer>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MapNavigation;
