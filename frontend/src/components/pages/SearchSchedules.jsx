import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const SearchSchedules = () => {
  const { t } = useTranslation();
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [time, setTime] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStations = async () => {
      try {
              const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stations`);
        setStations(res.data);
      } catch (err) {
        setError(t('failed_to_fetch_stations'));
      }
    };
    fetchStations();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSchedules([]); // Clear previous results
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (selectedStation) {
        params.station = selectedStation;
      }
      if (time) {
        params.time = time;
      }
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/schedules`, { params });
      setSchedules(res.data);
    } catch (err) {
      setError(t('failed_to_fetch_schedules'));
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
      className="container mx-auto p-4"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('search_schedules_title')}</h1>
        <p className="text-muted-foreground">{t('search_schedules_description')}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="station" className="block text-gray-700 text-m font-bold mb-2">
              {t('station')}:
            </label>
            <select
              id="station"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
            >
              <option value="">{t('select_a_station')}</option>
              {stations.map((station) => (
                <option key={station._id} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="time" className="block text-gray-700 text-m font-bold mb-2">
              {t('time')}:
            </label>
            <input
              type="time"
              id="time"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="text-m hover:bg-black hover:text-white rounded-md transition-all duration-300 ease-in-out px-4 py-2 border-black border-2 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              <span>{t('searching_schedules')}</span>
            </>
          ) : (
            t('search_schedules_button')
          )}
        </button>
        {error && <p className="text-red-500">{error}</p>}

        {schedules.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('available_schedules')}</h2>
            <ul>
              {schedules.map((schedule) => (
                <li key={schedule._id} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                  <p>
                    <strong>{t('from_colon')}</strong> {schedule.sourceStation}
                  </p>
                  <p>
                    <strong>{t('to_colon')}</strong> {schedule.destinationStation}
                  </p>
                  <p>
                    <strong>{t('departure_time_colon')}</strong> {schedule.departureTime}
                  </p>
                  <p>
                    <strong>{t('arrival_time_colon')}</strong> {schedule.arrivalTime}
                  </p>
                  <p>
                    <strong>{t('fare_colon')}</strong> {schedule.fare}৳
                  </p>
                  <p>
                    <strong>{t('frequency_colon')}</strong> {schedule.frequency}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
    </div>
    </div>
  );
};

export default SearchSchedules;
