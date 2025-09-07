import React, { useState } from 'react';
import homepageImg2 from '../../assets/homepage_img2.jpg';
import timeImage from '../../assets/time.png';
import ticketImage from '../../assets/ticket.png';
import ticketImage2 from '../../assets/ticket2.png';
import mapImage from '../../assets/map.png';
import { ArrowRight, Clock, Ticket, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '../ui/AnimatedSection';
import ScrollToTop from '../ui/ScrollToTop';

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Comp = asChild ? 'div' : 'button';
  return <Comp className={`${variant} ${size} ${className}`} {...props} />;
};

const Card = ({ className, ...props }) => (
  <div className={`card ${className}`} {...props} />
);

const ImageWithFallback = ({ src, alt, ...props }) => {
  const [error, setError] = useState(false);
  const handleError = () => setError(true);
  return error ? (
    <div className="image-fallback">
      Error
    </div>
  ) : (
    <img src={src} alt={alt} onError={handleError} {...props} />
  );
};

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl text-foreground max-w-xl">
                {t('hero_title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                {t('hero_description')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex items-center gap-2 hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2 text-lg" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}> 
                {t('get_started_now')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">{t('real_time_updates')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">{t('instant_booking')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">{t('location_based')}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <ImageWithFallback
                src={homepageImg2}
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
};

const Features = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: Clock,
      title: t('feature1_title'),
      description: t('feature1_description'),
      image: timeImage,
      action: t('view_schedules'),
      path: '/search-schedules'
    },
    {
      icon: Ticket,
      title: t('feature2_title'),
      description: t('feature2_description'),
      image: ticketImage2,
      action: t('book_now'),
      onClick: handleBookNow
    },
    {
      icon: MapPin,
      title: t('feature3_title'),
      description: t('feature3_description'),
      image: mapImage,
      action: t('find_stations'),
      path: '/map'
    }
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl text-foreground">
            {t('features_section_title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features_section_description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 ease-in-out group-hover:scale-105 object-position-top"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  {feature.path ? (
                    <Link to={feature.path} className="w-full">
                      <Button variant="outline" className="w-full border-gray-200 text-black rounded-md hover:bg-black hover:text-white flex items-center justify-center">
                        {feature.action}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Button onClick={feature.onClick} variant="outline" className="w-full border-gray-200 text-black rounded-md hover:bg-black hover:text-white flex items-center justify-center">
                      {feature.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl lg:text-4xl">
            {t('cta_title')}
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {t('cta_description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="flex items-center gap-2 hover:scale-110 transition-transform"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              {t('start_planning_trip')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 pt-8 text-sm opacity-75">
            <span>{t('verified_dmtcl')}</span>
            <span>{t('works_on_all_devices')}</span>
            <span>{t('real_time_updates_cta')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <AnimatedSection>
          <Hero />
        </AnimatedSection>
        <AnimatedSection delay={0.7}>
          <Features />
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
          <CallToAction />
        </AnimatedSection>
      </main>
    </div>
  );
}