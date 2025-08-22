import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ScheduleManagement = () => {
  const { token } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [sourceStation, setSourceStation] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  const [trainName, setTrainName] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
              const schedulesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/schedules`);
        setSchedules(schedulesRes.data);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleCreateSchedule = async () => {
    try {
      setLoading(true);
      setError('');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/schedules`,
        { sourceStation, destinationStation, trainName, departureTime, arrivalTime, frequency },
        config
      );
      setSchedules([...schedules, data]);
      setSourceStation('');
      setDestinationStation('');
      setTrainName('');
      setDepartureTime('');
      setArrivalTime('');
      setFrequency('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSchedule = async () => {
    try {
      setLoading(true);
      setError('');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const { data } = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/schedules/${editingSchedule._id}`,
        { sourceStation, destinationStation, trainName, departureTime, arrivalTime, frequency },
        config
      );
      setSchedules(
        schedules.map((s) => (s._id === editingSchedule._id ? data : s))
      );
      setEditingSchedule(null);
      setSourceStation('');
      setDestinationStation('');
      setTrainName('');
      setDepartureTime('');
      setArrivalTime('');
      setFrequency('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update schedule.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      setLoading(true);
      setError('');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/schedules/${id}`, config);
      setSchedules(schedules.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete schedule.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (schedule) => {
    setEditingSchedule(schedule);
    setSourceStation(schedule.sourceStation);
    setDestinationStation(schedule.destinationStation);
    setTrainName(schedule.trainName);
    setDepartureTime(schedule.departureTime);
    setArrivalTime(schedule.arrivalTime);
    setFrequency(schedule.frequency);
  };

  const cancelEditing = () => {
    setEditingSchedule(null);
    setSourceStation('');
    setDestinationStation('');
    setTrainName('');
    setDepartureTime('');
    setArrivalTime('');
    setFrequency('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Schedule Management</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Source Station"
            value={sourceStation}
            onChange={(e) => setSourceStation(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Destination Station"
            value={destinationStation}
            onChange={(e) => setDestinationStation(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Train Name"
            value={trainName}
            onChange={(e) => setTrainName(e.target.value)}
          />
          <Input
            type="time"
            placeholder="Departure Time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
          <Input
            type="time"
            placeholder="Arrival Time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Frequency (minutes)"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-4">
          {editingSchedule && (
            <Button onClick={cancelEditing} className="mr-2" variant="secondary">
              Cancel
            </Button>
          )}
          <Button
            onClick={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}
            disabled={loading}
          >
            {loading
              ? editingSchedule
                ? 'Updating...'
                : 'Creating...'
              : editingSchedule
              ? 'Update Schedule'
              : 'Create Schedule'}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Schedules</h2>
        {loading && schedules.length === 0 ? (
          <p>Loading schedules...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">Source Station</th>
                  <th className="py-2 px-4 border-b">Destination Station</th>
                  <th className="py-2 px-4 border-b">Train Name</th>
                  <th className="py-2 px-4 border-b">Departure Time</th>
                  <th className="py-2 px-4 border-b">Arrival Time</th>
                  <th className="py-2 px-4 border-b">Frequency (min)</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule._id}>
                    <td className="py-2 px-4 border-b">{schedule.sourceStation}</td>
                    <td className="py-2 px-4 border-b">{schedule.destinationStation}</td>
                    <td className="py-2 px-4 border-b">{schedule.trainName}</td>
                    <td className="py-2 px-4 border-b">{schedule.departureTime}</td>
                    <td className="py-2 px-4 border-b">{schedule.arrivalTime}</td>
                    <td className="py-2 px-4 border-b">{schedule.frequency}</td>
                    <td className="py-2 px-4 border-b">
                      <Button
                        onClick={() => startEditing(schedule)}
                        className="mr-2"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteSchedule(schedule._id)}
                        disabled={loading}
                        variant="danger"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </td>
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

export default ScheduleManagement;
