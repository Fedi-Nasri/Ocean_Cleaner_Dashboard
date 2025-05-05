
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapIcon, Edit } from "lucide-react";

interface MapHeaderProps {
  isEditing: boolean;
  mapName: string;
  currentMap: any;
  setMapName: (name: string) => void;
  handleSaveMap: () => void;
  handleCancelEdit: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

const MapHeader = ({ 
  isEditing, 
  mapName, 
  currentMap, 
  setMapName, 
  handleSaveMap, 
  handleCancelEdit, 
  setIsEditing 
}: MapHeaderProps) => {
  return (
    <header className="bg-white border-b border-ocean-100 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-ocean-800 flex items-center">
          <MapIcon className="mr-2 h-6 w-6 text-ocean-600" />
          Maps & Navigation
        </h1>
        
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              placeholder="Map Name"
              className="w-64"
            />
            <Button onClick={handleSaveMap} className="bg-ocean-600 hover:bg-ocean-700">
              Save
            </Button>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        ) : (
          currentMap && (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-ocean-600 hover:bg-ocean-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Map
            </Button>
          )
        )}
      </div>
    </header>
  );
};

export default MapHeader;
