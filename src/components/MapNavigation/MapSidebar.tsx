
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Plus, Edit, Trash2, Layers } from "lucide-react";
import { NavigationMap } from "@/hooks/useMapNavigation";

interface MapSidebarProps {
  maps: NavigationMap[];
  selectedMap: string | null;
  onMapSelect: (id: string) => void;
  onCreateMap: () => void;
  onDeleteMap: (id: string) => void;
  onEditMap: (id: string) => void;
}

const MapSidebar = ({ 
  maps, 
  selectedMap, 
  onMapSelect, 
  onCreateMap, 
  onDeleteMap, 
  onEditMap 
}: MapSidebarProps) => {
  return (
    <div className="w-72 border-l border-ocean-100 bg-white h-full overflow-auto">
      <div className="p-4 border-b border-ocean-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ocean-800">Map Library</h2>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCreateMap();
            }} 
            size="sm" 
            className="bg-ocean-600 hover:bg-ocean-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Map
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        {maps.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Map className="mx-auto h-10 w-10 mb-2 text-ocean-300" />
            <p>No maps created yet</p>
            <p className="text-xs">Click "New Map" to create one</p>
          </div>
        ) : (
          maps.map((map) => (
            <Card 
              key={map.id} 
              className={`cursor-pointer hover:border-ocean-300 transition-colors ${selectedMap === map.id ? 'border-ocean-500 bg-ocean-50' : ''}`}
              onClick={() => onMapSelect(map.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{map.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Layers className="h-3 w-3 mr-1" />
                      {map.areas.length} area{map.areas.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditMap(map.id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive hover:text-destructive" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMap(map.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MapSidebar;
