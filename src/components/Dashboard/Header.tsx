
import { Waves, Menu, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/80 backdrop-blur-md border-b border-ocean-100 px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <Waves className="h-6 w-6 text-ocean-600" />
        <h1 className="text-xl font-semibold text-ocean-800">OceanClean Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center rounded-full bg-secondary px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
          <span className="text-sm font-medium">Robot Online</span>
        </div>
        
        <Button variant="ghost" size="icon" className="text-ocean-600">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-ocean-600">
          <Settings className="h-5 w-5" />
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-ocean-600">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-white">
            <nav className="flex flex-col gap-4 py-4">
              <a href="#" className="text-sm font-medium hover:text-ocean-600">Dashboard</a>
              <a href="#" className="text-sm font-medium hover:text-ocean-600">Robot Control</a>
              <a href="#" className="text-sm font-medium hover:text-ocean-600">Mission History</a>
              <a href="#" className="text-sm font-medium hover:text-ocean-600">Settings</a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
