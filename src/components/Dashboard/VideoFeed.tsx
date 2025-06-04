
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Play, Pause, Maximize, Camera, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Stream URLs - these would be your actual Flask server endpoints
const STREAM_URLS = {
  normal: "http://10.0.2.15:8080/video_feed",
  ai: "http://10.0.2.15:5000/video_feed"
};

const VideoFeed = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAIMode, setIsAIMode] = useState(false);
  const [streamUrl, setStreamUrl] = useState(STREAM_URLS.normal);
  
  // Update the current time every second for the timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update stream URL when mode changes
  useEffect(() => {
    const newUrl = isAIMode ? STREAM_URLS.ai : STREAM_URLS.normal;
    setStreamUrl(newUrl);
    toast.info(`Switched to ${isAIMode ? 'AI' : 'Normal'} stream mode`);
  }, [isAIMode]);
  
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
  
  const toggleStreamMode = () => {
    setIsAIMode(!isAIMode);
  };
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className="h-5 w-5 mr-2 text-ocean-600" />
            <span>Live Camera Feed</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-medium ${isAIMode ? 'text-ocean-600' : 'text-gray-500'}`}>
                AI Mode
              </span>
              <Switch
                checked={isAIMode}
                onCheckedChange={toggleStreamMode}
                aria-label="Toggle AI Mode"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm font-normal text-gray-500">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          id="video-container"
          className="relative aspect-video bg-gray-900 overflow-hidden"
        >
          {isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-800 to-ocean-900">
              {/* In a real implementation, this would be an iframe or img with src=streamUrl */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ocean-400/20 to-transparent animate-pulse-slow"></div>
                <div className="h-full w-full bg-wave-pattern bg-repeat-x bg-bottom animate-wave opacity-10"></div>
              </div>
              <div className="text-white text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-70">
                  {isAIMode ? 'AI-enhanced video stream' : 'Live video feed simulation'}
                </p>
                <p className="text-xs opacity-50 mt-1">
                  {isAIMode 
                    ? 'Processing video with object detection...' 
                    : 'Connecting to robot camera...'}
                </p>
                
                  <img
                    className="h-full w-full object-cover"
                    src={streamUrl}
                    alt="Live stream"
                  />
                
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <p className="text-white text-opacity-50">Feed paused</p>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full bg-black/30 text-white hover:bg-black/50"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <div className={`px-2 py-1 rounded text-xs font-medium ${isAIMode ? 'bg-ocean-500/70' : 'bg-gray-500/70'}`}>
                  {isAIMode ? 'AI Stream' : 'Normal Stream'}
                </div>
              </div>
              
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
