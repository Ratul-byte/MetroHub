
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ScheduleManagement = () => {
  const { token } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [trainName, setTrainName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedulesAndRoutes = async () => {
      try {
        setLoading(true);
        const [schedulesRes, routesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/schedules'),
          axios.get('http://localhost:5001/api/routes'),
        ]);
        setSchedules(schedulesRes.data);
        setRoutes(routesRes.data);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedulesAndRoutes();
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
        'http://localhost:5001/api/schedules',
        { route: selectedRoute, trainName, startTime, endTime, frequency },
        config
      );
      setSchedules([...schedules, data]);
      setSelectedRoute('');
      setTrainName('');
      setStartTime('');
      setEndTime('');
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
        `http://localhost:5001/api/schedules/${editingSchedule._id}`,
        { route: selectedRoute, trainName, startTime, endTime, frequency },
        config
      );
      setSchedules(
        schedules.map((s) => (s._id === editingSchedule._id ? data : s))
      );
      setEditingSchedule(null);
      setSelectedRoute('');
      setTrainName('');
      setStartTime('');
      setEndTime('');
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
      await axios.delete(`http://localhost:5001/api/schedules/${id}`, config);
      setSchedules(schedules.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete schedule.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (schedule) => {
    setEditingSchedule(schedule);
    setSelectedRoute(schedule.route._id);
    setTrainName(schedule.trainName);
    setStartTime(schedule.startTime);
    setEndTime(schedule.endTime);
    setFrequency(schedule.frequency);
  };

  const cancelEditing = () => {
    setEditingSchedule(null);
    setSelectedRoute('');
    setTrainName('');
    setStartTime('');
    setEndTime('');
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
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.name}
              </option>
            ))}
          </select>
          <Input
            type="text"
            placeholder="Train Name"
            value={trainName}
            onChange={(e) => setTrainName(e.target.value)}
          />
          <Input
            type="time"
            placeholder="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            type="time"
            placeholder="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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
                  <th className="py-2 px-4 border-b">Route</th>
                  <th className="py-2 px-4 border-b">Train Name</th>
                  <th className="py-2 px-4 border-b">Start Time</th>
                  <th className="py-2 px-4 border-b">End Time</th>
                  <th className="py-2 px-4 border-b">Frequency (min)</th>
                  <th className="py-2 px-4 border-b">Actions</th>
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
