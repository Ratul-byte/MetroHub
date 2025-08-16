import { Button } from "./ui/button";
import { ArrowRight, Clock, Ticket, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import metroStationImage from "figma:asset/16cb377928f0045cade11d7dbc011baa0049ed7c.png";

export function Hero() {
  return (
    <section className="relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl text-foreground max-w-xl">
                Your Metro Journey Made Simple
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Get real-time schedules, book tickets instantly, and find the nearest metro station. 
                All in one convenient platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex items-center gap-2">
                Get Started Now
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Instant Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Location-based</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <ImageWithFallback
                src={metroStationImage}
                alt="Dhaka University Metro Station"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}