
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/Dashboard/DashboardSidebar";
import MapSidebar from "@/components/Maps/MapSidebar";
import MapHeader from "@/components/Maps/MapHeader";
import MapContent from "@/components/Maps/MapContent";
import { useMapOperations } from "@/hooks/useMapOperations";

// Import Leaflet CSS and initialize configuration
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../components/Maps/LeafletConfig";

const Maps = () => {
  const {
    maps,
    selectedMapId,
    currentMap,
    isEditing,
    mapName,
    setSelectedMapId,
    setMapName,
    setIsEditing,
    handleCreateMap,
    handleDeleteMap,
    handleEditMap,
    handleSaveMap,
    handleCancelEdit,
    handleAreaCreated,
    handleAreaDeleted
  } = useMapOperations();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <SidebarInset className="bg-gradient-to-br from-ocean-50/50 to-white">
          <div className="flex flex-col min-h-screen">
            <MapHeader
              isEditing={isEditing}
              mapName={mapName}
              currentMap={currentMap}
              setMapName={setMapName}
              handleSaveMap={handleSaveMap}
              handleCancelEdit={handleCancelEdit}
              setIsEditing={setIsEditing}
            />
            
            <main className="flex-grow flex overflow-hidden">
              <MapContent
                isEditing={isEditing}
                currentMap={currentMap}
                handleAreaCreated={handleAreaCreated}
                handleAreaDeleted={handleAreaDeleted}
              />
              
              <MapSidebar
                maps={maps}
                selectedMap={selectedMapId}
                onMapSelect={setSelectedMapId}
                onCreateMap={handleCreateMap}
                onDeleteMap={handleDeleteMap}
                onEditMap={handleEditMap}
              />
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Maps;
