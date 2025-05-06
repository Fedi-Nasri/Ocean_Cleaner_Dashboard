
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import MapView from "@/components/MapNavigation/MapView";
import MapSidebar from "@/components/MapNavigation/MapSidebar";
import MapHeader from "@/components/MapNavigation/MapHeader";
import { useMapNavigation } from "@/hooks/useMapNavigation";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";
// Import Leaflet Draw CSS directly from node_modules
import "../assets/leaflet-draw.css";

const MapNavigation = () => {
  const {
    maps,
    selectedMapId,
    currentMap,
    isEditing,
    mapName,
    setMapName,
    setSelectedMapId,
    handleCreateMap,
    handleDeleteMap,
    handleAreaCreated,
    handleEditMap,
    handleSaveMap,
    handleCancelEdit,
    setIsEditing
  } = useMapNavigation();
  
  console.log("MapNavigation render, handleCreateMap:", !!handleCreateMap);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <SidebarInset className="bg-gradient-to-br from-ocean-50/50 to-white">
          <div className="flex flex-col h-screen">
            <MapHeader
              isEditing={isEditing}
              mapName={mapName}
              currentMap={currentMap}
              setMapName={setMapName}
              handleSaveMap={handleSaveMap}
              handleCancelEdit={handleCancelEdit}
              setIsEditing={setIsEditing}
            />
            
            <div className="flex-grow flex overflow-hidden">
              <MapView
                isEditing={isEditing}
                currentMap={currentMap}
                handleAreaCreated={handleAreaCreated}
              />
              
              <MapSidebar
                maps={maps}
                selectedMap={selectedMapId}
                onMapSelect={setSelectedMapId}
                onCreateMap={handleCreateMap}
                onDeleteMap={handleDeleteMap}
                onEditMap={handleEditMap}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MapNavigation;
