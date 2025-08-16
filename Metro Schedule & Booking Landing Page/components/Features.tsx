import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, CreditCard, MapPin, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import schedulesImage from "figma:asset/121b998775cd88b02ea6f8085c7412f01c334db1.png";

export function Features() {
  const features = [
    {
      icon: Clock,
      title: "Real-Time Schedules",
      description: "Get up-to-the-minute metro schedules with live delay notifications and platform information.",
      image: schedulesImage,
      action: "View Schedules"
    },
    {
      icon: CreditCard,
      title: "Quick Ticket Booking",
      description: "Book single trips, day passes, or monthly subscriptions with secure payment processing.",
      image: "https://images.unsplash.com/photo-1684128168360-7bf8aca7627a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZXRybyUyMHN0YXRpb258ZW58MXx8fHwxNzU1MjM4MjgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      action: "Book Now"
    },
    {
      icon: MapPin,
      title: "Station Finder",
      description: "Find the closest metro station to your location with walking directions and accessibility info.",
      image: "https://images.unsplash.com/photo-1736117703288-3f918a212c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRybyUyMG1hcCUyMHRyYW5zcG9ydGF0aW9ufGVufDF8fHx8MTc1NTIzODI4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      action: "Find Stations"
    }
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl text-foreground">
            Everything You Need for Metro Travel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your metro experience with our comprehensive suite of tools designed for modern commuters.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-primary/90 backdrop-blur-sm rounded-lg p-2">
                      <IconComponent className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}