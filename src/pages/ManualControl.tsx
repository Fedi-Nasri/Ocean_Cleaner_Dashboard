import { useState, useRef, useEffect } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize, Minimize, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ref, set } from "firebase/database";
import { database } from "@/lib/firebase";
import VideoFeed from "@/components/Dashboard/VideoFeed";
import Map from "@/components/Dashboard/Map";

const ManualControl = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentDirection, setCurrentDirection] = useState("stop");
  const [currentValue, setCurrentValue] = useState(0.0);
  const [currentRotation, setCurrentRotation] = useState(0.0);
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  
  const accelerationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rotationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to update Firebase with robot control data
  const updateRobotControl = async (direction: string, value: number, rotation: number) => {
    const controlData = {
      direction,
      value,
      rotation
    };
    
    console.log("Robot Control Update:", controlData);
    
    try {
      await set(ref(database, 'robot_control'), controlData);
    } catch (error) {
      console.error("Error updating robot control:", error);
      toast.error("Failed to update robot control");
    }
  };

  // Function to update mode in Firebase
  const updateMode = async (auto: boolean) => {
    const modeData = {
      auto
    };
    
    console.log("Mode Update:", modeData);
    
    try {
      await set(ref(database, 'mode'), modeData);
      toast.success(`Switched to ${auto ? 'Autonomous' : 'Manual'} mode`);
    } catch (error) {
      console.error("Error updating mode:", error);
      toast.error("Failed to update mode");
    }
  };

  // Initialize Firebase structure on component mount
  useEffect(() => {
    const initializeFirebaseStructure = async () => {
      try {
        await updateRobotControl("stop", 0.0, 0.0);
        await updateMode(false); // Initialize as manual mode
        console.log("Firebase robot_control and mode structures initialized");
      } catch (error) {
        console.error("Error initializing Firebase structure:", error);
      }
    };

    initializeFirebaseStructure();
  }, []);

  // Handle mode switch
  const handleModeSwitch = (checked: boolean) => {
    setIsAutonomousMode(checked);
    updateMode(checked);
    
    // If switching to autonomous mode, stop manual control
    if (checked) {
      handleStop();
    }
  };

  // Enhanced acceleration function for forward/backward movement with longer duration
  const accelerateMovement = (targetValue: number, direction: string) => {
    let currentVal = 0.0;
    const step = targetValue > 0 ? 0.1 : -0.1; // Smaller steps for smoother acceleration
    const steps = Math.abs(targetValue / step);
    let stepCount = 0;

    if (accelerationTimeoutRef.current) {
      clearInterval(accelerationTimeoutRef.current);
    }

    const accelerate = () => {
      if (stepCount < steps) {
        currentVal += step;
        stepCount++;
        setCurrentValue(currentVal);
        updateRobotControl(direction, currentVal, currentRotation);
        console.log(`Acceleration step ${stepCount}/${steps}: value=${currentVal.toFixed(1)}`);
      } else {
        if (accelerationTimeoutRef.current) {
          clearInterval(accelerationTimeoutRef.current);
        }
        console.log(`Acceleration complete: final value=${currentVal.toFixed(1)}`);
      }
    };

    accelerationTimeoutRef.current = setInterval(accelerate, 200); // Increased to 200ms for longer acceleration
  };

  // Enhanced acceleration function for rotation with longer duration
  const accelerateRotation = (targetRotation: number) => {
    let currentRot = 0.0;
    const step = targetRotation > 0 ? 0.1 : -0.1; // Smaller steps for smoother acceleration
    const steps = Math.abs(targetRotation / step);
    let stepCount = 0;

    if (rotationTimeoutRef.current) {
      clearInterval(rotationTimeoutRef.current);
    }

    const rotate = () => {
      if (stepCount < steps) {
        currentRot += step;
        stepCount++;
        setCurrentRotation(currentRot);
        updateRobotControl(currentDirection, currentValue, currentRot);
        console.log(`Rotation step ${stepCount}/${steps}: rotation=${currentRot.toFixed(1)}`);
      } else {
        if (rotationTimeoutRef.current) {
          clearInterval(rotationTimeoutRef.current);
        }
        console.log(`Rotation complete: final rotation=${currentRot.toFixed(1)}`);
      }
    };

    rotationTimeoutRef.current = setInterval(rotate, 200); // Increased to 200ms for longer acceleration
  };

  const handleMove = (direction: string) => {
    if (isAutonomousMode) return;

    setCurrentDirection(direction);
    
    switch (direction) {
      case "forward":
        setCurrentRotation(0.0);
        accelerateMovement(-2.0, direction);
        toast.info("Moving forward - accelerating to -2.0 (extended acceleration)");
        break;
      case "backward":
        setCurrentRotation(0.0);
        accelerateMovement(2.0, direction);
        toast.info("Moving backward - accelerating to 2.0 (extended acceleration)");
        break;
      case "left":
        setCurrentValue(0.0);
        accelerateRotation(-2.0);
        toast.info("Turning left - accelerating to -2.0 (extended acceleration)");
        break;
      case "right":
        setCurrentValue(0.0);
        accelerateRotation(2.0);
        toast.info("Turning right - accelerating to 2.0 (extended acceleration)");
        break;
    }
  };

  const handleStop = () => {
    // Clear any ongoing acceleration
    if (accelerationTimeoutRef.current) {
      clearInterval(accelerationTimeoutRef.current);
    }
    if (rotationTimeoutRef.current) {
      clearInterval(rotationTimeoutRef.current);
    }

    setCurrentDirection("stop");
    setCurrentValue(0.0);
    setCurrentRotation(0.0);
    updateRobotControl("stop", 0.0, 0.0);
    toast.info("Robot stopped");
    console.log("Robot stopped - all values reset to 0.0");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <SidebarInset className="bg-gradient-to-br from-ocean-50/50 to-white">
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/80 backdrop-blur-md border-b border-ocean-100 px-4 lg:px-6">
              <div className="flex items-center gap-2">
                <Waves className="h-6 w-6 text-ocean-600" />
                <h1 className="text-xl font-semibold text-ocean-800">Manual Control</h1>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-ocean-800">Manual</span>
                  <Switch
                    checked={isAutonomousMode}
                    onCheckedChange={handleModeSwitch}
                  />
                  <span className="text-sm font-medium text-ocean-800">Auto</span>
                </div>
                <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>
            </header>

            <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <VideoFeed />

                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-ocean-800">Control Panel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-2">
                          <div></div>
                          <Button 
                            className="bg-ocean-600 hover:bg-ocean-700" 
                            onClick={() => handleMove("forward")}
                            disabled={isAutonomousMode}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <div></div>
                          
                          <Button 
                            className="bg-ocean-600 hover:bg-ocean-700" 
                            onClick={() => handleMove("left")}
                            disabled={isAutonomousMode}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline"
                            onClick={handleStop}
                            disabled={isAutonomousMode}
                          >
                            Stop
                          </Button>
                          
                          <Button 
                            className="bg-ocean-600 hover:bg-ocean-700" 
                            onClick={() => handleMove("right")}
                            disabled={isAutonomousMode}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          
                          <div></div>
                          <Button 
                            className="bg-ocean-600 hover:bg-ocean-700" 
                            onClick={() => handleMove("backward")}
                            disabled={isAutonomousMode}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <div></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-ocean-800">Robot Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Mode:</span>
                          <span className="text-sm font-medium text-ocean-800">
                            {isAutonomousMode ? "Autonomous" : "Manual"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Direction:</span>
                          <span className="text-sm font-medium text-ocean-800 capitalize">{currentDirection}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Value:</span>
                          <span className="text-sm font-medium text-ocean-800">{currentValue.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Rotation:</span>
                          <span className="text-sm font-medium text-ocean-800">{currentRotation.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Connection:</span>
                          <span className="text-sm font-medium text-green-600">Online</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Signal Strength:</span>
                          <span className="text-sm font-medium text-ocean-800">92%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Latency:</span>
                          <span className="text-sm font-medium text-ocean-800">124ms</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

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

export default ManualControl;
