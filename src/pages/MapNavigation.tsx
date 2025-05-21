import { useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset } from "@/components/ui/sidebar";
import MapHeader from "@/components/MapNavigation/MapHeader";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { database } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";

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
  const [showDetails, setShowDetails] = useState<boolean>(false);

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
      const coordinates = layer.getLatLngs()[0].map((latlng: L.LatLng) => ({
        lat: latlng.lat,
        long: latlng.lng
    }));
      
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
      name: mapName,
      createdAt: Date.now(),
      coordinates: selectedAreas[0], // Assuming you want to send only the first selected area
    };

    console.log("Map data ready to be sent:", mapData);

    // Firebase code that would send the data (commented as requested)

    // Create a reference to the map name directly
    const mapRef = ref(database, `navigation/Maps/${mapName}`);
    // Set the data under the map name
    set(mapRef, mapData)
      .then(() => {
        console.log("Map data successfully sent to Firebase!");
        // Reset the form or provide user feedback here
      })
      .catch((error) => {
        console.error("Error sending map data to Firebase:", error);
      });

  };


  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveMap = () => {
    console.log("Map saved with name:", mapName);
    setIsEditing(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Dashboard sidebar - now always visible */}
      <DashboardSidebar />
      
      <div className="flex flex-1 min-h-screen">
        <SidebarInset className="flex-1 flex flex-col">
          <MapHeader 
            isEditing={isEditing} 
            mapName={mapName} 
            currentMap={selectedAreas.length > 0 ? { name: mapName } : null} 
            setMapName={setMapName}
            handleSaveMap={handleSaveMap}
            handleCancelEdit={handleCancelEdit}
            setIsEditing={setIsEditing}
          />
          
          <div className="p-4 flex-1">
            <div className="h-full border border-gray-300 rounded-lg overflow-hidden">
              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="h-[calc(100vh-10rem)]"
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

        {/* Sidebar now on the right side */}
        <Sidebar side="right">
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
                    onClick={toggleDetails}
                  >
                    {showDetails ? "Hide Details" : "View Details"}
                  </Button>
                  
                  {/* Area details section - shown when "View Details" is clicked */}
                  {showDetails && (
                    <div className="mt-4">
                      {selectedAreas.map((coordinates, index) => (
                        <Card key={index} className="mt-2 bg-white">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">Area {index + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="text-xs max-h-32 overflow-y-auto">
                              <p className="font-mono">
                                {JSON.stringify(coordinates, null, 2)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </SidebarContent>
        </Sidebar>
      </div>
    </div>
  );
};

export default MapNavigation;
