
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Waves, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, PieChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Pie, Cell } from "recharts";

// Sample data for charts
const dailyData = [
  { time: '00:00', temperature: 18.2, waterQuality: 91, batteryLevel: 85, wasteCollected: 0.2 },
  { time: '04:00', temperature: 17.8, waterQuality: 92, batteryLevel: 82, wasteCollected: 1.5 },
  { time: '08:00', temperature: 18.5, waterQuality: 90, batteryLevel: 78, wasteCollected: 3.7 },
  { time: '12:00', temperature: 19.2, waterQuality: 88, batteryLevel: 72, batteryLevel2: 74, batteryLevel3: 75, wasteCollected: 7.2 },
  { time: '16:00', temperature: 19.7, waterQuality: 87, batteryLevel: 66, batteryLevel2: 68, batteryLevel3: 69, wasteCollected: 9.8 },
  { time: '20:00', temperature: 19.1, waterQuality: 89, batteryLevel: 60, batteryLevel2: 62, batteryLevel3: 63, wasteCollected: 11.3 },
  { time: '24:00', temperature: 18.7, waterQuality: 90, batteryLevel: 56, batteryLevel2: 58, batteryLevel3: 59, wasteCollected: 12.4 },
];

const weeklyData = [
  { day: 'Monday', temperature: 18.5, waterQuality: 90, wasteCollected: 12.4 },
  { day: 'Tuesday', temperature: 18.7, waterQuality: 91, wasteCollected: 13.1 },
  { day: 'Wednesday', temperature: 19.2, waterQuality: 89, wasteCollected: 10.8 },
  { day: 'Thursday', temperature: 19.0, waterQuality: 88, wasteCollected: 11.5 },
  { day: 'Friday', temperature: 18.8, waterQuality: 90, wasteCollected: 14.2 },
  { day: 'Saturday', temperature: 19.3, waterQuality: 92, wasteCollected: 15.7 },
  { day: 'Sunday', temperature: 19.1, waterQuality: 91, wasteCollected: 13.9 },
];

const wasteTypeData = [
  { name: 'Plastics', value: 45 },
  { name: 'Metals', value: 15 },
  { name: 'Organics', value: 25 },
  { name: 'Other', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('daily');

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
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={timeRange === 'daily' ? dailyData : weeklyData}
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
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Water Quality Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={timeRange === 'daily' ? dailyData : weeklyData}
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
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="battery" className="mt-4">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Battery Discharge Pattern</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={timeRange === 'daily' ? dailyData : weeklyData}
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
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Waste Type Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
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
