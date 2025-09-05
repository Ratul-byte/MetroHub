import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/badge.jsx";
import { Separator } from "../ui/separator.jsx";
import { Clock, MapPin, CreditCard, Wallet, Train, ArrowRight, CheckCircle, ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert.jsx";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const parseTimeToMinutes = (t = '00:00') => {
  const [hh = '0', mm = '0'] = String(t).split(':');
  return Number(hh) * 60 + Number(mm);
};

const formatFareForLocale = (amount, i18n) => {
  try {
    const locale = i18n?.language === 'bn' ? 'bn-BD' : 'en-US';
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);
  } catch {
    return String(amount);
  }
};

export default function BookTicket() {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [stations, setStations] = useState([]);
  const [sourceStation, setSourceStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gateway");
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);

  const paymentSectionRef = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get(`${API}/api/stations`);
        setStations(res.data || []);
      } catch (err) {
        setError(t('failed_to_fetch_stations'));
      }
    };
    fetchStations();
  }, [t]);

  useEffect(() => {
    setSelectedSchedule(null);
    setSchedules([]);
    setError("");
    if (!sourceStation || !destinationStation) return;

    const fetchSchedules = async () => {
      setSchedulesLoading(true);
      try {
        const res = await axios.get(
          `${API}/api/schedules?sourceStation=${encodeURIComponent(sourceStation)}&destinationStation=${encodeURIComponent(destinationStation)}`
        );
        const data = res.data || [];
        setSchedules(data);
        if (data.length > 0) {
          setSelectedSchedule(data[0]);
        } else {
          setError(t('no_schedules_found'));
        }
      } catch (err) {
        console.error('fetch schedules error', err);
        setError(t('no_schedules_found'));
      } finally {
        setSchedulesLoading(false);
      }
    };

    fetchSchedules();
  }, [sourceStation, destinationStation, t]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaymentVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: "-100px 0px 0px 0px",
      }
    );

    if (paymentSectionRef.current) {
      observer.observe(paymentSectionRef.current);
    }

    return () => {
      if (paymentSectionRef.current) {
        observer.unobserve(paymentSectionRef.current);
      }
    };
  }, [selectedSchedule]);

  const scrollToPayment = () => {
    paymentSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleBookTicket = async () => {
    if (!selectedSchedule) {
      setError(t('please_select_schedule'));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const payload = {
        scheduleId: selectedSchedule.segmentIds ? selectedSchedule.segmentIds[0] : selectedSchedule.scheduleId || null,
        segmentIds: selectedSchedule.segmentIds || null,
        amount: selectedSchedule.fare || 0,
      };

      const res = await axios.post(`${API}/api/payment/init`, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        },
      });

      const gateway = res.data?.url || res.data?.GatewayPageURL || res.data?.redirect_url;
      if (gateway) window.location.replace(gateway);
      else setError(t('payment_initiation_failed'));
    } catch (err) {
      console.error('Payment initiation error', err.response?.data || err.message);
      setError(err.response?.data?.message || t('booking_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePayFromBalance = async () => {
    if (!selectedSchedule) {
      setError(t('please_select_schedule'));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const payload = {
        scheduleId: selectedSchedule.segmentIds ? selectedSchedule.segmentIds[0] : selectedSchedule.scheduleId || null,
        amount: selectedSchedule.fare || 0,
      };

      const res = await axios.post(`${API}/api/payment/pay-from-balance`, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json'
        },
      });

      const ticket = res.data;
      if (ticket && ticket._id) {
        // Fetch updated user data after successful payment
        const userRes = await axios.get(`${API}/api/user/profile`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        console.log('User profile API response:', userRes.data);
        updateUser(userRes.data); // Update user context with new balance
        window.location.href = `/payment-success?ticket=${ticket._id}`;
      } else {
        setError(t('payment_failed'));
      }
    } catch (err) {
      console.error('Pay from balance error', err.response?.data || err.message);
      setError(err.response?.data?.message || t('payment_failed') || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{t('book_your_ticket')}</h1>
            <p className="text-muted-foreground">{t('select_route_description')}</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Station Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('select_your_route')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-m font-semibold">{t('from')}</label>
                    <select
                      value={sourceStation}
                      onChange={(e) => setSourceStation(e.target.value)}
                      className={`w-full rounded-xl p-2 border-2 ${sourceStation ? 'border-black' : 'border-gray-300'}`}>
                      <option value="">{t('select_departure_station')}</option>
                      {stations.map((station) => (
                        <option key={station._id} value={station.name}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-m font-semibold">{t('to')}</label>
                    <select
                      value={destinationStation}
                      onChange={(e) => setDestinationStation(e.target.value)}
                      className={`w-full rounded-xl p-2 border-2 ${destinationStation ? 'border-black' : 'border-gray-300'}`}>
                      <option value="">{t('select_destination_station')}</option>
                      {stations.filter(s => s.name !== sourceStation).map((station) => (
                        <option key={station._id} value={station.name}>
                          {station.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {sourceStation && destinationStation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        {t('available_schedules')}
                      </h3>

                      {schedulesLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-20 bg-muted rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      ) : schedules.length > 0 ? (
                        <div className="space-y-3">
                          {schedules.map((schedule) => {
                            const departureMinutes = parseTimeToMinutes(schedule.departureTime);
                            const arrivalMinutes = parseTimeToMinutes(schedule.arrivalTime);
                            const duration = arrivalMinutes - departureMinutes;
                            
                            return (
                              <motion.div
                                key={schedule._id}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Card 
                                  className={`cursor-pointer transition-all ${
                                    selectedSchedule?._id === schedule._id 
                                      ? 'ring-2 ring-primary bg-primary/5' 
                                      : 'hover:shadow-md'
                                  }`}
                                  onClick={() => setSelectedSchedule(schedule)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Train className="h-4 w-4 text-primary" />
                                          <span className="font-semibold">{schedule.trainName}</span>
                                          <Badge variant="outline">{schedule.direction}</Badge>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                          <span>{schedule.departureTime}</span>
                                          <ArrowRight className="h-4 w-4" />
                                          <span>{schedule.arrivalTime}</span>
                                          <span>• {duration} {t('min')}</span>
                                        </div>
                                        
                                        <div className="mt-2 text-sm text-muted-foreground">
                                          {schedule.path}
                                        </div>
                                      </div>
                                      
                                      <div className="text-right">
                                        <div className="text-lg font-bold text-primary">
                                          ৳{formatFareForLocale(schedule.fare, i18n)}
                                        </div>
                                        {selectedSchedule?._id === schedule._id && (
                                          <CheckCircle className="h-5 w-5 text-green-600 ml-auto mt-1" />
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Train className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('no_schedules_found_for_this_route')}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Journey Summary */}
            {selectedSchedule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="rounded-xl border shadow-lg">
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      {t('journey_summary')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-m text-muted-foreground">{t('route')}</span>
                          <span className="text-base font-medium">{sourceStation} ---→ {destinationStation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-m text-muted-foreground">{t('train')}</span>
                          <span className="text-base font-medium">{selectedSchedule.trainName}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-m text-muted-foreground">{t('departure')}</span>
                          <span className="text-base font-medium">{selectedSchedule.departureTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-m text-muted-foreground">{t('arrival')}</span>
                          <span className="text-base font-medium">{selectedSchedule.arrivalTime}</span>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">{t('total_fare')}</span>
                      <span className="text-2xl font-bold text-primary">৳{formatFareForLocale(selectedSchedule.fare, i18n)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment Method Selection - More Prominent */}
            {selectedSchedule && (
              <motion.div
                ref={paymentSectionRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="rounded-xl border shadow-lg">
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <CreditCard className="h-6 w-6" />
                      {t('choose_payment_method')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{t('select_payment_description')}</p>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    {user.role === "rapidPassUser" ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        <motion.div 
                          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === "gateway" 
                              ? 'border-primary bg-primary/10 shadow-lg' 
                              : 'border-border hover:border-primary/30 hover:shadow-md'
                          }`}
                          onClick={() => setPaymentMethod("gateway")}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-center space-y-3">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                              paymentMethod === "gateway" ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}>
                              <CreditCard className="h-8 w-8" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{t('payment_gateway')}</h3>
                              <p className="text-sm text-muted-foreground">
                                {t('payment_gateway_description')}
                              </p>
                            </div>
                            {paymentMethod === "gateway" && (
                              <div className="flex items-center justify-center gap-2 text-primary">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">{t('selected')}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>

                        <motion.div 
                          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === "balance" 
                              ? 'border-primary bg-primary/10 shadow-lg' 
                              : 'border-border hover:border-primary/30 hover:shadow-md'
                          }`}
                          onClick={() => setPaymentMethod("balance")}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-center space-y-3">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                              paymentMethod === "balance" ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}>
                              <Wallet className="h-8 w-8" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{t('rapid_pass_balance')}</h3>
                              <p className="text-sm text-muted-foreground">
                                {t('pay_instantly_from_wallet')}
                              </p>
                              <div className="mt-2">
                                <span className="text-lg font-bold text-green-600">
                                  ৳{user && user.passBalance ? user.passBalance.toFixed(2) : '0.00'} {t('available')}
                                </span>
                              </div>
                            </div>
                            {paymentMethod === "balance" && (
                              <div className="flex items-center justify-center gap-2 text-primary">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">{t('selected')}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="p-6 border-2 border-primary rounded-xl bg-primary/5">
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <CreditCard className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">Payment Gateway</h3>
                            <p className="text-sm text-muted-foreground">
                              {t('secure_payment_description')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Button */}
                    <div className="pt-4 flex justify-center items-center">
                      <Button 
                        onClick={paymentMethod === 'gateway' ? handleBookTicket : handlePayFromBalance}
                        disabled={loading || !selectedSchedule || (paymentMethod === "balance" && user.balance < selectedSchedule.fare)}
                                                  className="text-lg hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2 border-black border-2"
                        size="lg"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>{t('processing_payment')}</span>
                          </div>
                        ) : paymentMethod === "balance" && user.balance < selectedSchedule.fare ? (
                          t('insufficient_balance')
                        ) : (
                          <div className="flex items-center gap-3 center px-4">
                            {paymentMethod === "balance" ? <Wallet className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                            <span>
                              {paymentMethod === "balance" ? t('pay_from_balance') : t('proceed_to_payment')} - ৳{formatFareForLocale(selectedSchedule.fare, i18n)}
                            </span>
                          </div>
                        )}
                      </Button>
                      
                      {paymentMethod === "balance" && user.balance < selectedSchedule.fare && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-sm text-orange-700">
                            {t('insufficient_balance_top_up_message')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Floating Scroll to Payment Button */}
          <AnimatePresence>
            {selectedSchedule && !isPaymentVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
                className="fixed bottom-6 right-6 z-50 group"
              >
                <motion.div
                  animate={{ 
                    y: [0, -4, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Button
                    onClick={scrollToPayment}
                    size="lg"
                    className="rounded-full h-16 w-16 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 relative overflow-hidden"
                    aria-label="Scroll to payment section"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, 3, 0],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ChevronDown className="h-6 w-6" />
                    </motion.div>
                    
                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/20"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Button>
                </motion.div>
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap backdrop-blur-sm">
                  {t('go_to_payment')}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}