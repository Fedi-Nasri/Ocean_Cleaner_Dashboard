
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Waves, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { LineChart, BarChart, PieChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Pie, Cell } from "recharts";
import { 
  listenToDailySensorData, 
  listenToWeeklySensorData, 
  listenToWasteTypeData,
  SensorReading,
  WasteTypeData
} from "@/services/statisticsService";

// Define chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('daily');
  const [dailyData, setDailyData] = useState<SensorReading[]>([]);
  const [weeklyData, setWeeklyData] = useState<SensorReading[]>([]);
  const [wasteTypeData, setWasteTypeData] = useState<WasteTypeData[]>([]);
  const [loading, setLoading] = useState({
    daily: true,
    weekly: true,
    wasteType: true
  });
  const [error, setError] = useState<string | null>(null);

  // Set up Firebase listeners
  useEffect(() => {
    // Set initial loading states
    setLoading({
      daily: true,
      weekly: true,
      wasteType: true
    });
    setError(null);

    // Listen for daily sensor data
    const unsubscribeDaily = listenToDailySensorData(
      (data) => {
        setDailyData(data);
        setLoading(prev => ({ ...prev, daily: false }));
      },
      (error) => {
        console.error("Error in daily sensor data:", error);
        setError("Failed to load daily sensor data. Please try again later.");
        setLoading(prev => ({ ...prev, daily: false }));
      }
    );

    // Listen for weekly sensor data
    const unsubscribeWeekly = listenToWeeklySensorData(
      (data) => {
        setWeeklyData(data);
        setLoading(prev => ({ ...prev, weekly: false }));
      },
      (error) => {
        console.error("Error in weekly sensor data:", error);
        setError("Failed to load weekly sensor data. Please try again later.");
        setLoading(prev => ({ ...prev, weekly: false }));
      }
    );

    // Listen for waste type data
    const unsubscribeWasteType = listenToWasteTypeData(
      (data) => {
        setWasteTypeData(data);
        setLoading(prev => ({ ...prev, wasteType: false }));
      },
      (error) => {
        console.error("Error in waste type data:", error);
        setError("Failed to load waste type data. Please try again later.");
        setLoading(prev => ({ ...prev, wasteType: false }));
      }
    );

    // Notify user that real-time data is active
    toast.info("Connected to real-time data stream", {
      description: "Charts will update automatically as new data arrives"
    });

    // Clean up listeners on unmount
    return () => {
      unsubscribeDaily();
      unsubscribeWeekly();
      unsubscribeWasteType();
    };
  }, []);

  // Handle empty data state
  const hasNoData = (
    (timeRange === 'daily' && dailyData.length === 0) || 
    (timeRange === 'weekly' && weeklyData.length === 0)
  );

  // Get the current data based on time range
  const currentData = timeRange === 'daily' ? dailyData : weeklyData;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <SidebarInset className="bg-gradient-to-br from-ocean-50/50 to-white">
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/80 backdrop-blur-md border-b border-ocean-100 px-4 lg:px-6">
              <div className="flex items-center gap-2">
                <Waves className="h-6 w-6 text-ocean-600" />
                <h1 className="text-xl font-semibold text-ocean-800">Statistics</h1>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-ocean-600" />
                <Button variant="outline" size="sm">Export Data</Button>
              </div>
            </header>

            <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="sensors" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="sensors">Sensor Data</TabsTrigger>
                    <TabsTrigger value="battery">Battery Statistics</TabsTrigger>
                    <TabsTrigger value="waste">Waste Collection</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant={timeRange === 'daily' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTimeRange('daily')}
                    >
                      Daily
                    </Button>
                    <Button 
                      variant={timeRange === 'weekly' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTimeRange('weekly')}
                    >
                      Weekly
                    </Button>
                  </div>
                </div>

                <TabsContent value="sensors" className="mt-4 space-y-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Temperature Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading.daily && timeRange === 'daily' && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
                          <span className="ml-2">Loading temperature data...</span>
                        </div>
                      )}
                      {loading.weekly && timeRange === 'weekly' && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
                          <span className="ml-2">Loading temperature data...</span>
                        </div>
                      )}
                      {!loading[timeRange === 'daily' ? 'daily' : 'weekly'] && (
                        hasNoData ? (
                          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                            <AlertTriangle className="h-8 w-8 mb-2" />
                            <p>No temperature data available for this time period</p>
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                              data={currentData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey={timeRange === 'daily' ? 'time' : 'day'} />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="temperature" 
                                stroke="#0EA5E9" 
                                name="Water Temperature (°C)"
                                activeDot={{ r: 8 }} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Water Quality Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading[timeRange === 'daily' ? 'daily' : 'weekly'] ? (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
                          <span className="ml-2">Loading water quality data...</span>
                        </div>
                      ) : hasNoData ? (
                        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                          <AlertTriangle className="h-8 w-8 mb-2" />
                          <p>No water quality data available for this time period</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            data={currentData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={timeRange === 'daily' ? 'time' : 'day'} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="waterQuality" 
                              stroke="#3B82F6" 
                              name="Water Quality (%)"
                              activeDot={{ r: 8 }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="battery" className="mt-4">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Battery Discharge Pattern</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading.daily ? (
                        <div className="flex items-center justify-center h-[400px]">
                          <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
                          <span className="ml-2">Loading battery data...</span>
                        </div>
                      ) : dailyData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                          <AlertTriangle className="h-8 w-8 mb-2" />
                          <p>No battery data available</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart
                            data={dailyData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[50, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="batteryLevel" 
                              stroke="#10B981" 
                              name="Cell 1 (%)"
                              strokeWidth={2}
                              activeDot={{ r: 8 }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="batteryLevel2" 
                              stroke="#059669" 
                              name="Cell 2 (%)"
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                              connectNulls 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="batteryLevel3" 
                              stroke="#047857" 
                              name="Cell 3 (%)"
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                              connectNulls 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="waste" className="mt-4 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Waste Collected Over Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading[timeRange === 'daily' ? 'daily' : 'weekly'] ? (
                          <div className="flex items-center justify-center h-[300px]">
                            <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
                            <span className="ml-2">Loading waste collection data...</span>
                          </div>
                        ) : hasNoData ? (
                          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                            <AlertTriangle className="h-8 w-8 mb-2" />
                            <p>No waste collection data available for this time period</p>
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                              data={currentData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey={timeRange === 'daily' ? 'time' : 'day'} />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar 
                                dataKey="wasteCollected" 
                                fill="#22C55E" 
                                name="Waste Collected (kg)"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Waste Type Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading.wasteType ? (
                          <div className="flex items-center justify-center h-[300px]">
                            <Loader2 className="h-8 w-8 animate-spin text-ocean-600" />
                            <span className="ml-2">Loading waste type data...</span>
                          </div>
                        ) : wasteTypeData.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                            <AlertTriangle className="h-8 w-8 mb-2" />
                            <p>No waste type data available</p>
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={wasteTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {wasteTypeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
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

export default Statistics;
