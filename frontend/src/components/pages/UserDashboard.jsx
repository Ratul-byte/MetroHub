import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { ArrowRight, Clock, Ticket, MapPin, TrendingUp, Wallet, Shield, Cross, DollarSignIcon } from 'lucide-react';
import timeImage from '../../assets/time.png';
import ticketImage from '../../assets/ticket.png';
import { Icon } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import image0 from '../../assets/Hero/0.jpg';
import image1 from '../../assets/Hero/1.png';
import image2 from '../../assets/Hero/2.jpg';
import image3 from '../../assets/Hero/3.jpg';
import image4 from '../../assets/Hero/4.jpg';
import image5 from '../../assets/Hero/5.png';


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
    <div className="image-fallback" {...props}>
      Error
    </div>
  ) : (
    <img src={src} alt={alt} onError={handleError} {...props} />
  );
};

const UserHero = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    image0, image1, image2, image3, image4, image5
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl text-foreground max-w-xl">
                {t('welcome_back')}, {user?.name || 'User'}!
              </h1>
              <p className="text-lg font-bold text-muted-foreground max-w-lg">
                {t('user_hero_description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book-tickets">
                    <Button size="lg" className="hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2 border-black border-2">
                        <div className="flex items-center justify-center">
                        <Ticket className="h-4 w-7" />
                        </div>
                        <div className="flex items-center justify-center">
                        {i18n.language === "en" ? "Book New Trip " : "নতুন ট্রিপ বুক করুন "}
                        <ArrowRight className="h-4 w-4" />
                        </div>
                    </Button>
                </Link>
                <Link to="/search-schedules">
                    <Button size="lg" className="hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2 border-black border-2">
                        <div className="flex items-center justify-center">
                        <Clock className="h-4 w-7" />
                        </div>
                        <div className="flex items-center justify-center">
                        {i18n.language === "en" ? "Live Schedules " : "লাইভ সময়সূচী "}
                        < ArrowRight className="h-4 w-4" />
                        </div>
                    </Button>
                </Link>
                <Link to="/map">
                    <Button size="lg" className="hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2 border-black border-2">
                        <div className="flex items-center justify-center">
                        <MapPin className="h-4 w-7" />
                        </div>
                        <div className="flex items-center justify-center">
                        {i18n.language === "en" ? "Find Stations " : "স্টেশন খুঁজুন "}
                        <ArrowRight className="h-4 w-4" />
                        </div>
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-md border-b-4">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm font-bold text-blue-600">
                  {i18n.language === "en" ? "Trips This Month" : "এই মাসে যাত্রা"}
                </div>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-md border-b-4">
                <div className="flex items-center justify-center mb-2">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {user && user.rapidPassId ? `৳${user.passBalance}` : 'N/A'}
                </div>
                <div className="text-sm font-bold text-green-600">
                  {i18n.language === "en" ? "Rapid Pass Balance" : "র‍্যাপিড পাস ব্যালেন্স"}
                </div>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200 rounded-md border-b-4">
                <div className="flex items-center justify-center mb-2">
                  <DollarSignIcon className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">৳0</div>
                <div className="text-sm font-bold text-red-600">
                  {i18n.language === "en" ? "Due Fines" : "জরিমানা বাকি"}
                </div>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide} 
                  src={heroImages[currentSlide]}
                  alt="Metro Station"
                  className="w-full h-96 lg:h-[500px] object-cover center rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 1.1 }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MyTicketsSection = () => {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      if (user && token) {
        try {
          setLoadingTickets(true);
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/tickets`, {
            headers: {
              'x-auth-token': token,
            },
          });
          setTickets(response.data);
        } catch (err) {
          setTicketsError(err.response?.data?.message || t('failed_to_fetch_ticket_details'));
        } finally {
          setLoadingTickets(false);
        }
      }
    };
    fetchTickets();
  }, [user, token]);

  if (!user) {
    return null; // Don't render if user is not logged in
  }

  return (
    <section id="my-tickets" className="py-16 lg:py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl text-foreground text-center mb-2">
          {t('my_tickets')}
        </h2>
        <div className="text-center mb-8">
          {t("txt_2")}<Link to="/booking-history" className="text-blue-500 hover:underline">
            {t('here')}
          </Link>
        </div>
        {loadingTickets ? (
          <div className="text-center">{t('loading')}</div>
        ) : ticketsError ? (
          <div className="text-center text-red-500">{ticketsError}</div>
        ) : tickets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white p-6 rounded-lg shadow-md">
                <p><strong>{t('ticket_id')}</strong> {ticket._id}</p>
                <p><strong>{t('train')}</strong> {ticket.schedule.trainName}</p>
                <p><strong>{t('from')}</strong> {ticket.schedule.sourceStation}</p>
                <p><strong>{t('to')}</strong> {ticket.schedule.destinationStation}</p>
                <p><strong>{t('departure')}</strong> {ticket.schedule.departureTime}</p>
                <p><strong>{t('arrival')}</strong> {ticket.schedule.arrivalTime}</p>
                <p><strong>{t('fare')}</strong> {ticket.amount} {t('bdt')}</p>
                <p><strong>{t('status')}</strong> {ticket.paymentStatus}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">{t('no_tickets_found')}</p>
        )}
      </div>
    </section>
  );
};

const Features = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
  
    const handleBookNow = () => {
        navigate('/book-tickets');
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
        image: ticketImage,
        action: t('book_now'),
        onClick: handleBookNow
      },
      {
        icon: MapPin,
        title: t('feature3_title'),
        description: t('feature3_description'),
        image: "https://images.unsplash.com/photo-1736117703288-3f918a212c31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRybyUyMG1hcCUyMHRyYW5zcG9ydGF0aW9ufGVufDF8fHx8MTc1NTIzODI4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <UserHero />
        <MyTicketsSection />
        <Features />
      </main>
    </div>
  );
}
