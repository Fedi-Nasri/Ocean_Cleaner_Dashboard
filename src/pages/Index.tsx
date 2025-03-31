
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Dashboard/Header";
import SensorPanel from "@/components/Dashboard/SensorPanel";
import VideoFeed from "@/components/Dashboard/VideoFeed";
import Map from "@/components/Dashboard/Map";
import StatusCard from "@/components/Dashboard/StatusCard";
import { Waves, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";

const Index = () => {
  const [missionStartTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleModeSwitch = () => {
    toast.success("Switching to manual control mode");
    navigate("/manual-control");
  };
  
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <SidebarInset className="bg-gradient-to-br from-ocean-50/50 to-white">
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-ocean-800">Autonomous Mode</h2>
                <Button onClick={handleModeSwitch} className="bg-ocean-600 hover:bg-ocean-700">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Switch to Manual Control
                </Button>
              </div>
              
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
