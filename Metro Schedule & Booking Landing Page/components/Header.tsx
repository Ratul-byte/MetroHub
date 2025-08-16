import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import logo from "figma:asset/4a1a335c4fdfaadbf0a052fa357bfe08ec1c9dc9.png";

export function Header() {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="MetroHub Logo" className="h-10 w-auto" />
            <span className="text-xl font-semibold text-foreground">MetroHub</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#schedules" className="text-foreground hover:text-primary transition-colors">
              Schedules
            </a>
            <a href="#booking" className="text-foreground hover:text-primary transition-colors">
              Book Tickets
            </a>
            <a href="#map" className="text-foreground hover:text-primary transition-colors">
              Find Stations
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:flex">
              Sign In
            </Button>
            <Button>
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}