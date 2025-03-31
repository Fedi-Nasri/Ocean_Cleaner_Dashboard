
import { useState } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play, Maximize, Minimize, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const ManualControl = () => {
  const [speed, setSpeed] = useState(50);
  const [depth, setDepth] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMove = (direction: string) => {
    toast.info(`Moving ${direction} at ${speed}% speed`);
  };

  const handleDepthChange = (value: number[]) => {
    setDepth(value[0]);
    toast.info(`Setting depth to ${value[0]} meters`);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    toast.success(isPaused ? "Resuming manual control" : "Pausing manual control");
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
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={togglePause}>
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>
                <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>
            </header>

            <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="glass-card overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-ocean-800">Live Video Feed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-64 md:h-96 bg-ocean-900/10 rounded-md flex items-center justify-center">
                        <div className="text-ocean-500">Live Camera Feed</div>
                        <div className="absolute bottom-4 right-4">
                          <Button variant="secondary" size="sm">Snapshot</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-ocean-800">Control Panel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-ocean-800">Speed Control</label>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground w-10">{speed}%</span>
                            <Slider
                              value={[speed]}
                              min={0}
                              max={100}
                              step={5}
                              onValueChange={(value) => setSpeed(value[0])}
                              className="flex-grow"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-ocean-800">Depth Control</label>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground w-10">{depth}m</span>
                            <Slider
                              value={[depth]}
                              min={0}
                              max={20}
                              step={0.5}
                              onValueChange={handleDepthChange}
                              className="flex-grow"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div></div>
                          <Button 
                            className="bg-ocean-600 hover:bg-ocean-700" 
                            onClick={() => handleMove("forward")}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <div></div>
                          
                          <Button 
                            className="bg-ocean-600 hover:bg-ocean-700" 
                            onClick={() => handleMove("left")}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setIsPaused(true);
                              toast.info("Robot stopped");
                            }}
                          >
                            Stop
                          </Button>
                          
                          <Button 
                            className="bg-ocean-600 hover:bg-ocean-700" 
                            onClick={() => handleMove("right")}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          
                          <div></div>
                          <Button 
                            className="bg-ocean-600 hover:bg-ocean-700" 
                            onClick={() => handleMove("backward")}
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
                      <CardTitle className="text-ocean-800">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Mode:</span>
                          <span className="text-sm font-medium text-ocean-800">Manual</span>
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

                  <Card className="glass-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-ocean-800">GPS Coordinates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-ocean-100 rounded-md flex items-center justify-center">
                        Map View
                      </div>
                    </CardContent>
                  </Card>
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
