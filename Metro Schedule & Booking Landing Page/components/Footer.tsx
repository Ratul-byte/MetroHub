import { Mail, Phone, Github, Twitter, Linkedin } from "lucide-react";
import logo from "figma:asset/4a1a335c4fdfaadbf0a052fa357bfe08ec1c9dc9.png";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="MetroHub Logo" className="h-8 w-auto" />
              <span className="text-lg font-semibold">MetroHub</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Making metro travel easier and more efficient for everyone, one journey at a time.
            </p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Real-time Schedules</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Ticket Booking</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Station Finder</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Route Planning</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@metrohub.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                1-800-METRO-HUB
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MetroHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}