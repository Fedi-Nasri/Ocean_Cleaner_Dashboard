
import { useState, useEffect } from "react";
import Header from "@/components/Dashboard/Header";
import SensorPanel from "@/components/Dashboard/SensorPanel";
import VideoFeed from "@/components/Dashboard/VideoFeed";
import Map from "@/components/Dashboard/Map";
import StatusCard from "@/components/Dashboard/StatusCard";
import { Waves } from "lucide-react";

const Index = () => {
  const [missionStartTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-ocean-50 to-white">
        <Waves className="h-12 w-12 text-ocean-500 animate-pulse mb-4" />
        <h1 className="text-2xl font-semibold text-ocean-800 mb-2">OceanClean Dashboard</h1>
        <p className="text-ocean-600">Connecting to robot systems...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-ocean-50/50 to-white">
      <Header />
      
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VideoFeed />
              <StatusCard missionStartTime={missionStartTime} />
            </div>
            
            <SensorPanel />
          </div>
          
          <div className="lg:col-span-1">
            <Map />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-ocean-100 py-4 px-6 text-center text-sm text-gray-500">
        OceanClean Robot Monitoring System | © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Index;
