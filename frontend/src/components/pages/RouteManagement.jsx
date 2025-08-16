
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RouteManagement = () => {
  const { token } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [name, setName] = useState('');
  const [selectedStations, setSelectedStations] = useState([]);
  const [editingRoute, setEditingRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoutesAndStations = async () => {
      try {
        setLoading(true);
        const [routesRes, stationsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/routes'),
          axios.get('http://localhost:5001/api/stations'),
        ]);
        setRoutes(routesRes.data);
        setStations(stationsRes.data);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoutesAndStations();
  }, []);

  const handleCreateRoute = async () => {
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
        'http://localhost:5001/api/routes',
        { name, stations: selectedStations },
        config
      );
      setRoutes([...routes, data]);
      setName('');
      setSelectedStations([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create route.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoute = async () => {
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
        `http://localhost:5001/api/routes/${editingRoute._id}`,
        { name, stations: selectedStations },
        config
      );
      setRoutes(routes.map((r) => (r._id === editingRoute._id ? data : r)));
      setEditingRoute(null);
      setName('');
      setSelectedStations([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update route.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      setLoading(true);
      setError('');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete(`http://localhost:5001/api/routes/${id}`, config);
      setRoutes(routes.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete route.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (route) => {
    setEditingRoute(route);
    setName(route.name);
    setSelectedStations(route.stations.map((s) => s._id));
  };

  const cancelEditing = () => {
    setEditingRoute(null);
    setName('');
    setSelectedStations([]);
  };

  const handleStationSelection = (stationId) => {
    setSelectedStations((prev) =>
      prev.includes(stationId)
        ? prev.filter((id) => id !== stationId)
        : [...prev, stationId]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Route Management</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingRoute ? 'Edit Route' : 'Create New Route'}
        </h2>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Route Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Stations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stations.map((station) => (
              <div key={station._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`station-${station._id}`}
                  checked={selectedStations.includes(station._id)}
                  onChange={() => handleStationSelection(station._id)}
                  className="mr-2"
                />
                <label htmlFor={`station-${station._id}`}>{station.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          {editingRoute && (
            <Button onClick={cancelEditing} className="mr-2" variant="secondary">
              Cancel
            </Button>
          )}
          <Button
            onClick={editingRoute ? handleUpdateRoute : handleCreateRoute}
            disabled={loading}
          >
            {loading
              ? editingRoute
                ? 'Updating...'
                : 'Creating...'
              : editingRoute
              ? 'Update Route'
              : 'Create Route'}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Routes</h2>
        {loading && routes.length === 0 ? (
          <p>Loading routes...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Stations</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route._id}>
                    <td className="py-2 px-4 border-b">{route.name}</td>
                    <td className="py-2 px-4 border-b">
                      {route.stations.map((s) => s.name).join(', ')}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Button
                        onClick={() => startEditing(route)}
                        className="mr-2"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteRoute(route._id)}
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

export default RouteManagement;
