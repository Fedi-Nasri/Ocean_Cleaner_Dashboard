
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, BellRing, Shield, Map } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [mapApiKey, setMapApiKey] = useState("");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  
  const [darkMode, setDarkMode] = useState(false);
  
  const handleSaveMapApiKey = () => {
    // In a real app, you would save this to your backend or localStorage
    localStorage.setItem("mapApiKey", mapApiKey);
    toast.success("Map API key saved successfully");
  };
  
  const handleToggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <SidebarInset className="bg-gradient-to-br from-ocean-50/50 to-white">
          <div className="flex flex-col min-h-screen">
            <header className="bg-white border-b border-ocean-100 py-4 px-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-ocean-800 flex items-center">
                  <SettingsIcon className="mr-2 h-6 w-6 text-ocean-600" />
                  Settings
                </h1>
              </div>
            </header>
            
            <main className="flex-grow p-6">
              <div className="max-w-4xl mx-auto">
                <Tabs defaultValue="general">
                  <TabsList className="mb-6">
                    <TabsTrigger value="general" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      General
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center">
                      <BellRing className="mr-2 h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="maps" className="flex items-center">
                      <Map className="mr-2 h-4 w-4" />
                      Maps
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>
                          Customize how the application looks on your device
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="dark-mode">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">
                              Switch between light and dark mode
                            </p>
                          </div>
                          <Switch 
                            id="dark-mode" 
                            checked={darkMode} 
                            onCheckedChange={setDarkMode} 
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your account profile information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue="Ocean Cleaner" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="contact@oceancleaner.com" />
                        </div>
                        
                        <Button className="bg-ocean-600 hover:bg-ocean-700">
                          Update Profile
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>
                          Choose when and how you'd like to be notified
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="email-notifications">Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                              </p>
                            </div>
                            <Switch 
                              id="email-notifications" 
                              checked={notifications.email} 
                              onCheckedChange={() => handleToggleNotification("email")} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="push-notifications">Push Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive push notifications in your browser
                              </p>
                            </div>
                            <Switch 
                              id="push-notifications" 
                              checked={notifications.push} 
                              onCheckedChange={() => handleToggleNotification("push")} 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor="sms-notifications">SMS Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications via SMS
                              </p>
                            </div>
                            <Switch 
                              id="sms-notifications" 
                              checked={notifications.sms} 
                              onCheckedChange={() => handleToggleNotification("sms")} 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="maps" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Map Settings</CardTitle>
                        <CardDescription>
                          Configure map-related settings and API keys
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="map-api-key">Map API Key</Label>
                          <Input 
                            id="map-api-key" 
                            placeholder="Enter your Mapbox API key" 
                            value={mapApiKey}
                            onChange={(e) => setMapApiKey(e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            The API key used for map services. Get a key from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-ocean-600 hover:underline">mapbox.com</a>
                          </p>
                        </div>
                        
                        <Button 
                          onClick={handleSaveMapApiKey}
                          className="bg-ocean-600 hover:bg-ocean-700"
                        >
                          Save API Key
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                          Change your password
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        
                        <Button className="bg-ocean-600 hover:bg-ocean-700">
                          Update Password
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
