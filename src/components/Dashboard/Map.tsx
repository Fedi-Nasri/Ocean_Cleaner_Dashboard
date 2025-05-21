
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapIcon, Navigation, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { listenToRobotPosition } from "@/services/mapService";

// Fix Leaflet icon issues
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapApiKey, setMapApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [robotLocation, setRobotLocation] = useState({
    lat: 25.774,
    lng: -80.19,
  });
  
  // Listen to robot position updates from Firebase
  useEffect(() => {
    if (!showApiKeyInput) {
      const unsubscribe = listenToRobotPosition((position) => {
        if (position) {
          setRobotLocation({
            lat: position[0],
            lng: position[1]
          });
        }
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [showApiKeyInput]);
  
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapApiKey.trim()) {
      setShowApiKeyInput(false);
    }
  };
  
  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapIcon className="h-5 w-5 mr-2 text-ocean-600" />
            <span>Robot Location</span>
          </div>
          
          {!showApiKeyInput && (
            <div className="flex items-center text-sm font-normal text-gray-500">
              <Navigation className="h-4 w-4 mr-1 text-ocean-500" />
              <span>
                {robotLocation.lat.toFixed(6)}, {robotLocation.lng.toFixed(6)}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        {showApiKeyInput ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-b-lg p-4">
            <div className="max-w-md w-full">
              <h3 className="text-lg font-medium mb-2 text-ocean-800">Map API Key Required</h3>
              <p className="text-sm text-gray-600 mb-4">
                To display the map, please enter your Mapbox API key. 
                You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-ocean-600 hover:underline">mapbox.com</a>
              </p>
              
              <form onSubmit={handleApiKeySubmit} className="space-y-3">
                <div className="relative">
                  <input 
                    type="text" 
                    value={mapApiKey}
                    onChange={(e) => setMapApiKey(e.target.value)}
                    placeholder="Enter your Mapbox API key" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-ocean-600 hover:bg-ocean-700">
                  Set API Key
                </Button>
                
                <p className="text-xs text-gray-500 mt-2">
                  For demo purposes, you can enter any text as an API key.
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-full h-full min-h-[300px] rounded-b-lg relative">
            <MapContainer 
              center={[robotLocation.lat, robotLocation.lng]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
              className="rounded-b-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[robotLocation.lat, robotLocation.lng]}>
                <Popup>
                  Robot is here
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Map;
