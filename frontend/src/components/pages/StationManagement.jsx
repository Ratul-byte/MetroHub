
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const StationManagement = () => {
  const { token } = useAuth();
  const [stations, setStations] = useState([]);
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [editingStation, setEditingStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/stations');
        setStations(response.data);
      } catch (err) {
        setError('Failed to fetch stations.');
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handleAddStation = async () => {
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
        'http://localhost:5001/api/stations',
        { name, latitude, longitude },
        config
      );
      setStations([...stations, data]);
      setName('');
      setLatitude('');
      setLongitude('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add station.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStation = async () => {
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
        `http://localhost:5001/api/stations/${editingStation._id}`,
        { name, latitude, longitude },
        config
      );
      setStations(
        stations.map((s) => (s._id === editingStation._id ? data : s))
      );
      setEditingStation(null);
      setName('');
      setLatitude('');
      setLongitude('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update station.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStation = async (id) => {
    try {
      setLoading(true);
      setError('');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete(`http://localhost:5001/api/stations/${id}`, config);
      setStations(stations.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete station.');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (station) => {
    setEditingStation(station);
    setName(station.name);
    setLatitude(station.latitude);
    setLongitude(station.longitude);
  };

  const cancelEditing = () => {
    setEditingStation(null);
    setName('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Station Management</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingStation ? 'Edit Station' : 'Add New Station'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Station Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-4">
          {editingStation && (
            <Button onClick={cancelEditing} className="mr-2" variant="secondary">
              Cancel
            </Button>
          )}
          <Button
            onClick={editingStation ? handleUpdateStation : handleAddStation}
            disabled={loading}
          >
            {loading
              ? editingStation
                ? 'Updating...'
                : 'Adding...'
              : editingStation
              ? 'Update Station'
              : 'Add Station'}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Stations</h2>
        {loading && stations.length === 0 ? (
          <p>Loading stations...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Latitude</th>
                  <th className="py-2 px-4 border-b">Longitude</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station) => (
                  <tr key={station._id}>
                    <td className="py-2 px-4 border-b">{station.name}</td>
                    <td className="py-2 px-4 border-b">{station.latitude}</td>
                    <td className="py-2 px-4 border-b">{station.longitude}</td>
                    <td className="py-2 px-4 border-b">
                      <Button
                        onClick={() => startEditing(station)}
                        className="mr-2"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteStation(station._id)}
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

export default StationManagement;
