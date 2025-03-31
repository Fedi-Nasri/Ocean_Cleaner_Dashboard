
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, RotateCw, AlertTriangle, Clock, Signal, Zap } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type StatusCardProps = {
  missionStartTime?: Date;
};

const StatusCard = ({ missionStartTime = new Date() }: StatusCardProps) => {
  const getElapsedTime = () => {
    const now = new Date();
    const elapsed = now.getTime() - missionStartTime.getTime();
    
    // Convert to hours, minutes, seconds
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Demonstrate some statuses
  const statuses = [
    { 
      name: "System", 
      status: "operational", 
      icon: <Check className="h-4 w-4" />,
      color: "text-green-500 bg-green-50"
    },
    { 
      name: "Collection System", 
      status: "active", 
      icon: <RotateCw className="h-4 w-4" />,
      color: "text-ocean-500 bg-ocean-50"
    },
    { 
      name: "Sensors", 
      status: "operational", 
      icon: <Check className="h-4 w-4" />,
      color: "text-green-500 bg-green-50",
      hasDropdown: true,
      details: [
        { name: "Temperature Sensor", status: "operational", health: 100 },
        { name: "Water Quality Sensor", status: "operational", health: 98 },
        { name: "Pressure Sensor", status: "caution", health: 75 },
        { name: "GPS Sensor", status: "operational", health: 95 },
        { name: "Motion Sensor", status: "operational", health: 92 }
      ]
    },
    { 
      name: "Communication", 
      status: "stable", 
      icon: <Check className="h-4 w-4" />,
      color: "text-green-500 bg-green-50"
    },
    { 
      name: "Navigation", 
      status: "caution", 
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-amber-500 bg-amber-50"
    },
    { 
      name: "Signal Strength", 
      status: "85%", 
      icon: <Signal className="h-4 w-4" />,
      color: "text-green-500 bg-green-50"
    },
    { 
      name: "Latency", 
      status: "42ms", 
      icon: <Zap className="h-4 w-4" />,
      color: "text-ocean-500 bg-ocean-50"
    },
  ];
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-ocean-600" />
          <span>Mission Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Mission Duration</p>
              <p className="text-2xl font-semibold text-ocean-700">{getElapsedTime()}</p>
            </div>
            <Badge variant="outline" className="bg-ocean-50 text-ocean-700 border-ocean-200">
              In Progress
            </Badge>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-2">
            {statuses.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{item.name}</span>
                {item.hasDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className={`${item.color} flex items-center gap-1.5 px-2 py-0.5 capitalize h-auto`}>
                        {item.icon}
                        {item.status}
                        {item.details?.some(d => d.status === "caution" || d.status === "critical") && (
                          <AlertTriangle className="h-3 w-3 text-amber-500 ml-1" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Sensors Status</div>
                      {item.details?.map((sensor, i) => (
                        <DropdownMenuItem key={i} className="p-2 focus:bg-transparent cursor-default">
                          <div className="w-full space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{sensor.name}</span>
                              <Badge variant="outline" className={
                                sensor.status === "operational" 
                                  ? "bg-green-50 text-green-700" 
                                  : sensor.status === "caution" 
                                  ? "bg-amber-50 text-amber-700 flex items-center gap-1" 
                                  : "bg-red-50 text-red-700 flex items-center gap-1"
                              }>
                                {sensor.status === "caution" && <AlertTriangle className="h-3 w-3" />}
                                {sensor.status}
                              </Badge>
                            </div>
                            <Progress 
                              value={sensor.health} 
                              className="h-1.5" 
                              indicatorClassName={
                                sensor.health > 80 ? "bg-green-500" :
                                sensor.health > 50 ? "bg-amber-500" : 
                                "bg-red-500"
                              }
                            />
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Badge variant="outline" className={`${item.color} flex items-center gap-1.5 px-2 py-0.5 capitalize`}>
                    {item.icon}
                    {item.status}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
