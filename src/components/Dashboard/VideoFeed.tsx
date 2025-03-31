
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Play, Pause, Maximize, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoFeed = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update the current time every second for the timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleFullscreen = () => {
    const videoElement = document.getElementById('video-container');
    
    if (!document.fullscreenElement) {
      if (videoElement?.requestFullscreen) {
        videoElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className="h-5 w-5 mr-2 text-ocean-600" />
            <span>Live Camera Feed</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-normal text-gray-500">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          id="video-container"
          className="relative aspect-video bg-gray-900 overflow-hidden"
        >
          {/* For demo purposes, using placeholder for video feed */}
          {isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-800 to-ocean-900">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ocean-400/20 to-transparent animate-pulse-slow"></div>
                <div className="h-full w-full bg-wave-pattern bg-repeat-x bg-bottom animate-wave opacity-10"></div>
              </div>
              <div className="text-white text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-70">Live video feed simulation</p>
                <p className="text-xs opacity-50 mt-1">Connecting to robot camera...</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <p className="text-white text-opacity-50">Feed paused</p>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-black/30 text-white hover:bg-black/50"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-black/30 text-white hover:bg-black/50"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoFeed;
