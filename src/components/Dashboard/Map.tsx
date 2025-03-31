
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon, Navigation, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapApiKey, setMapApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  
  // Mock robot GPS coordinates - this would normally come from the robot's API
  const [robotLocation, setRobotLocation] = useState({
    lat: 25.774,
    lng: -80.19,
  });
  
  // Simulate robot movement
  useEffect(() => {
    if (!showApiKeyInput && mapApiKey) {
      const interval = setInterval(() => {
        setRobotLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [showApiKeyInput, mapApiKey]);
  
  // Initialize or update map when API key is set
  useEffect(() => {
    if (!showApiKeyInput && mapApiKey && mapRef.current) {
      // This is a placeholder for actual map integration
      // In a real application, you would initialize a map library here
      
      // For example, to initialize a map with Mapbox:
      // mapboxgl.accessToken = mapApiKey;
      // const map = new mapboxgl.Map({
      //   container: mapRef.current,
      //   style: 'mapbox://styles/mapbox/satellite-v9',
      //   center: [robotLocation.lng, robotLocation.lat],
      //   zoom: 13
      // });
      
      // For now, we'll just show a message in the map container
      mapRef.current.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center bg-ocean-50 rounded-md">
          <div class="text-center p-4">
            <p class="text-ocean-800 mb-2">Map initialized with API key: ${mapApiKey.substring(0, 6)}...</p>
            <p class="text-sm text-ocean-600">Robot coordinates: ${robotLocation.lat.toFixed(6)}, ${robotLocation.lng.toFixed(6)}</p>
            <div class="mt-4 p-3 bg-white rounded-md shadow-sm">
              <p class="text-xs text-gray-500">In a real implementation, this would display an interactive map showing the robot's location.</p>
              <p class="text-xs text-gray-400 mt-1">You can use libraries like Mapbox, Google Maps, or Leaflet.</p>
            </div>
          </div>
        </div>
      `;
    }
  }, [showApiKeyInput, mapApiKey, robotLocation]);
  
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
          <div ref={mapRef} className="w-full h-full min-h-[300px] rounded-b-lg relative">
            {/* Map will be initialized here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Map;
