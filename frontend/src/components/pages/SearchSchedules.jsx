import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

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
        setLoading(true);
        const res = await axios.get('http://localhost:5001/api/stations');
        setStations(res.data);
      } catch (err) {
        setError('Failed to fetch stations.');
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('http://localhost:5001/api/schedules', {
        params: {
          stationId: selectedStation,
          time,
        },
      });
      setSchedules(res.data);
    } catch (err) {
      setError('Failed to fetch schedules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('search_schedules')}</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">{t('select_station')}</option>
              {stations.map((station) => (
                <option key={station._id} value={station._id}>
                  {station.name}
                </option>
              ))}
            </select>
            <Input
              type="time"
              placeholder={t('time')}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? t('searching') : t('search')}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{t('search_results')}</h2>
        {loading && schedules.length === 0 ? (
          <p>{t('loading_schedules')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">{t('route')}</th>
                  <th className="py-2 px-4 border-b">{t('train_name')}</th>
                  <th className="py-2 px-4 border-b">{t('start_time')}</th>
                  <th className="py-2 px-4 border-b">{t('end_time')}</th>
                  <th className="py-2 px-4 border-b">{t('frequency_min')}</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule._id}>
                    <td className="py-2 px-4 border-b">{schedule.route.name}</td>
                    <td className="py-2 px-4 border-b">{schedule.trainName}</td>
                    <td className="py-2 px-4 border-b">{schedule.startTime}</td>
                    <td className="py-2 px-4 border-b">{schedule.endTime}</td>
                    <td className="py-2 px-4 border-b">{schedule.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSchedules;