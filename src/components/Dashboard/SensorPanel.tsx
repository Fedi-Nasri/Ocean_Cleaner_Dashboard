
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Battery, Wind, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data - would be replaced with real-time data from an API
const mockSensorData = {
  temperature: 18.5,
  waterQuality: 92,
  batteryLevel: 78,
  speed: 2.3,
  depth: 5.2,
  wasteCollected: 12.4,
};

const SensorPanel = () => {
  const [sensorData, setSensorData] = useState(mockSensorData);
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData({
        temperature: Math.max(15, Math.min(22, sensorData.temperature + (Math.random() - 0.5))),
        waterQuality: Math.max(70, Math.min(99, sensorData.waterQuality + (Math.random() - 0.5) * 2)),
        batteryLevel: Math.max(0, Math.min(100, sensorData.batteryLevel - Math.random() * 0.2)),
        speed: Math.max(0, Math.min(5, sensorData.speed + (Math.random() - 0.5) * 0.3)),
        depth: Math.max(1, Math.min(10, sensorData.depth + (Math.random() - 0.5) * 0.2)),
        wasteCollected: sensorData.wasteCollected + Math.random() * 0.05,
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [sensorData]);
  
  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-green-500";
    if (level > 30) return "text-amber-500";
    return "text-red-500";
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2 text-ocean-500" />
              Water Temperature
            </span>
            <span className="sensor-value text-lg">{sensorData.temperature.toFixed(1)}°C</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-300 to-ocean-500 rounded-full" 
              style={{ width: `${(sensorData.temperature - 15) * 100 / 7}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>15°C</span>
            <span>22°C</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center">
              <Droplets className="h-4 w-4 mr-2 text-ocean-500" />
              Water Quality
            </span>
            <span className="sensor-value text-lg">{sensorData.waterQuality.toFixed(0)}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={sensorData.waterQuality} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center">
              <Battery className={`h-4 w-4 mr-2 ${getBatteryColor(sensorData.batteryLevel)}`} />
              Battery Level
            </span>
            <span className="sensor-value text-lg">{sensorData.batteryLevel.toFixed(0)}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress 
            value={sensorData.batteryLevel} 
            className={`h-2 ${
              sensorData.batteryLevel > 60 ? "bg-green-100" : 
              sensorData.batteryLevel > 30 ? "bg-amber-100" : "bg-red-100"
            }`} 
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center">
              <Wind className="h-4 w-4 mr-2 text-ocean-500" />
              Speed
            </span>
            <span className="sensor-value text-lg">{sensorData.speed.toFixed(1)} knots</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-ocean-300 to-ocean-600 rounded-full" 
              style={{ width: `${sensorData.speed * 100 / 5}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0</span>
            <span>5 knots</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-ocean-500" />
              Depth
            </span>
            <span className="sensor-value text-lg">{sensorData.depth.toFixed(1)} m</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-marine-300 to-marine-600 rounded-full" 
              style={{ width: `${sensorData.depth * 100 / 10}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0 m</span>
            <span>10 m</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4 mr-2 text-ocean-500"
              >
                <path d="M3 6h18"></path>
                <path d="M10 12h11"></path>
                <path d="M7 18h14"></path>
              </svg>
              Waste Collected
            </span>
            <span className="sensor-value text-lg">{sensorData.wasteCollected.toFixed(1)} kg</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-300 to-green-500 rounded-full" 
              style={{ width: `${Math.min(100, sensorData.wasteCollected * 5)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>0 kg</span>
            <span>20 kg</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensorPanel;
