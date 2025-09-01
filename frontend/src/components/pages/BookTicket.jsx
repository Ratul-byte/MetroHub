import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

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

const BookTicket = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [stations, setStations] = useState([]);
  const [sourceStation, setSourceStation] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get(`${API}/api/stations`);
        setStations(res.data || []);
      } catch (err) {
        setError(t('failed_to_fetch_stations') || 'Failed to fetch stations.');
      }
    };
    fetchStations();
  }, [t]);

  useEffect(() => {
    setSelectedSchedule(null);
    setSchedules([]);
    setError('');
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
          setError(t('no_schedules_found') || 'No schedules found for selected route.');
        }
      } catch (err) {
        console.error('fetch schedules error', err);
        setError(t('no_schedules_found') || 'No schedules found for selected route.');
      } finally {
        setSchedulesLoading(false);
      }
    };

    fetchSchedules();
  }, [sourceStation, destinationStation, t]);

  const handleSelect = (sched) => {
    setSelectedSchedule(sched);
  };

  const handleBookTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!selectedSchedule) {
      setError(t('please_select_schedule') || 'Please select a schedule.');
      setLoading(false);
      return;
    }

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
      else setError(t('payment_initiation_failed') || 'Failed to initiate payment.');
    } catch (err) {
      console.error('Payment initiation error', err.response?.data || err.message);
      setError(err.response?.data?.message || t('booking_failed') || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayFromBalance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!selectedSchedule) {
      setError(t('please_select_schedule') || 'Please select a schedule.');
      setLoading(false);
      return;
    }

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
        window.location.href = `/payment-success?ticket=${ticket._id}`;
      } else {
        setError(t('payment_failed') || 'Payment failed.');
      }
    } catch (err) {
      console.error('Pay from balance error', err.response?.data || err.message);
      setError(err.response?.data?.message || t('payment_failed') || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('book_tickets')}</h1>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('source_station')}</label>
              <select
                value={sourceStation}
                onChange={(e) => setSourceStation(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">{t('Select Source Station')}</option>
                {stations.map((st) => (
                  <option key={st._id} value={st.name}>{st.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('destination_station')}</label>
              <select
                value={destinationStation}
                onChange={(e) => setDestinationStation(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">{t('Select Destination Station')}</option>
                {stations.map((st) => (
                  <option key={st._id} value={st.name}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>

          {sourceStation && destinationStation && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">{t('available_schedules') || 'Available Schedules'}</h2>

                {schedulesLoading && <p>{t('loading') || 'Loading schedules...'}</p>}

                {!schedulesLoading && schedules.length > 0 && (
                  <div className="space-y-3">
                    {schedules.map((s) => {
                      const dep = s.departureTime || (s.stations && s.stations[0] && s.stations[0].departureTime) || '';
                      const arr = s.arrivalTime || (s.stations && s.stations[s.stations.length - 1] && s.stations[s.stations.length - 1].arrivalTime) || '';
                      const durationMin = dep && arr ? Math.abs(parseTimeToMinutes(arr) - parseTimeToMinutes(dep)) : null;
                      const path = (s.stations && s.stations.join(' -> ')) || (s.path) || '';
                      return (
                        <div
                          key={s.trainName + (s.departureTime || s.fare)}
                          onClick={() => handleSelect(s)}
                          className={`flex flex-col md:flex-row items-start md:items-center justify-between p-3 border rounded-md cursor-pointer ${selectedSchedule === s ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                        >
                          <div className="flex-1">
                            <div className="font-semibold">{s.trainName}</div>
                            <div className="text-sm text-gray-600">{s.direction || ''} · {dep} → {arr} {durationMin ? `· ${durationMin} min` : ''}</div>
                            {path && <div className="text-sm text-gray-700 mt-2">{path}</div>}
                            <div className="text-sm text-gray-800 mt-2 font-medium">
                              {t('estimated_fare', { amount: formatFareForLocale(s.fare || 0, i18n) })}
                              {i18n?.language === 'bn' ? ' টাকা' : ' BDT'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!schedulesLoading && schedules.length === 0 && (
                  <p className="text-sm text-gray-500">{t('no_schedules_found') || 'No schedules found for this route.'}</p>
                )}
              </div>
            </>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={handleBookTicket}
              disabled={loading || !selectedSchedule}
              className={`w-full bg-indigo-600 text-white rounded-md py-2 px-4 transition transform hover:bg-indigo-700 hover:shadow-md hover:-translate-y-1 ${(!selectedSchedule || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? t('processing_payment') : t('Proceed to Payment')}
            </Button>
            {user && user.role === 'rapidPassUser' && (
              <Button
                type="button"
                onClick={handlePayFromBalance}
                disabled={loading || !selectedSchedule}
                className={`w-full bg-green-600 text-white rounded-md py-2 px-4 transition transform hover:bg-green-700 hover:shadow-md hover:-translate-y-1 ${(!selectedSchedule || loading) ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? t('processing_payment') : t('Pay from Rapid Pass Balance')}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookTicket;
