import { Button } from "./ui/button";
import { ArrowRight, Download } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl lg:text-4xl">
            Ready to Transform Your Metro Experience?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of commuters who have already simplified their daily travel with MetroHub. 
            Get started today and never miss another train.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="flex items-center gap-2"
            >
              Start Planning Your Trip
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="flex items-center gap-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Download className="h-4 w-4" />
              Download MetroHub App
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 pt-8 text-sm opacity-75">
            <span>✓ No registration required</span>
            <span>✓ Works on all devices</span>
            <span>✓ Real-time updates</span>
          </div>
        </div>
      </div>
    </section>
  );
}