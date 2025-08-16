import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

import Button from "../ui/Button";
import Input from "../ui/Input";
import { 
  Users, Settings, Train, MapPin, AlertTriangle, Bell, 
  Plus, Edit, Trash2, Clock, Home, LogOut, Search,
  UserCheck, Shield, DollarSign, Calendar, Route,
  MessageSquare, AlertCircle, CheckCircle
} from "lucide-react";
import UserManagement from './UserManagement'; // Import the UserManagement component
import logo from '../../assets/logo main 1.png'; // Use existing logo

export default function AdminDashboard() {
  const [normalUsersCount, setNormalUsersCount] = useState(0);
  const [rapidPassUsersCount, setRapidPassUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const { data } = await axios.get('http://localhost:5001/api/admin/users', config);
        setNormalUsersCount(data.normalUsersCount);
        setRapidPassUsersCount(data.rapidPassUsersCount);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchUserCounts();
  }, [token]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  // Admin Header Component (recreated with basic HTML/Tailwind)
  const AdminHeader = () => (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="MetroHub Logo" className="h-10 w-auto" />
            <span className="text-xl font-semibold text-gray-800">MetroHub Admin</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setActiveSection("dashboard")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === "dashboard" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveSection("users")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === "users" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              User Management
            </button>
            <button 
              onClick={() => setActiveSection("schedules")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === "schedules" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              Schedules & Routes
            </button>
            <button 
              onClick={() => setActiveSection("fines")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === "fines" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              Fine Management
            </button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" className="hidden md:flex text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md">
              <Shield className="h-4 w-4 mr-2" />
              Admin User
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} // Placeholder for actual logout
              className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );

  // Dashboard Content (recreated with basic HTML/Tailwind)
  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return (
          <div className="space-y-6">
            <UserManagement />
          </div>
        );

      case "schedules":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Schedules & Routes Management</h1>
              <div className="flex gap-2">
                <Button variant="outline" className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Station
                </Button>
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Schedule
                </Button>
              </div>
            </div>

            {/* Station Management */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-600" />
                Station Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Name (English)</label>
                  <Input type="text" placeholder="Enter station name" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Name (Bangla)</label>
                  <Input type="text" placeholder="স্টেশনের নাম" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Code</label>
                  <Input type="text" placeholder="e.g., UN01" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform Count</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select platforms</option>
                    <option value="1">1 Platform</option>
                    <option value="2">2 Platforms</option>
                    <option value="3">3 Platforms</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Station Instructions</label>
                <textarea placeholder="Enter special instructions for this station..." className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"></textarea>
              </div>
              <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Station</Button>
            </div>

            {/* Schedule Management */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                Train Schedule Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select route</option>
                    <option value="line1">Line 1 (Uttara - Motijheel)</option>
                    <option value="line2">Line 2 (Kamalapur - Gabtali)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Station</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select station</option>
                    <option value="uttara-north">Uttara North</option>
                    <option value="shahbag">Shahbag</option>
                    <option value="dhanmondi">Dhanmondi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                  <Input type="time" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency (minutes)</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select frequency</option>
                    <option value="5">Every 5 minutes</option>
                    <option value="10">Every 10 minutes</option>
                    <option value="15">Every 15 minutes</option>
                  </select>
                </div>
              </div>
              <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Schedule</Button>
            </div>

            {/* Route Management */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Route className="h-5 w-5 text-gray-600" />
                Route Configuration
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Line 1", stations: "Uttara North → Uttara Center → Shahbag → New Market → Motijheel", status: "Active" },
                  { name: "Line 2", stations: "Kamalapur → Dhanmondi → Kalabagan → Gabtali", status: "Under Construction" }
                ].map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-800">{route.name}</div>
                      <div className="text-sm text-gray-500">{route.stations}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${route.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {route.status}
                      </span>
                      <Button variant="ghost" size="sm" className="p-2 rounded-md hover:bg-gray-100">
                        <Edit className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Announcements */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                Service Announcements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Announcement (English)</label>
                  <textarea placeholder="Enter announcement in English..." className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Announcement (Bangla)</label>
                  <textarea placeholder="বাংলায় ঘোষণা লিখুন..." className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Affected Routes</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select routes</option>
                    <option value="all">All Routes</option>
                    <option value="line1">Line 1 Only</option>
                    <option value="line2">Line 2 Only</option>
                  </select>
                </div>
              </div>
              <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Publish Announcement</Button>
            </div>
          </div>
        );

      case "fines":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Fine Management</h1>
              <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Manual Fine Entry
              </Button>
            </div>

            {/* Fine Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">47</div>
                    <div className="text-sm text-gray-500">Active Fines</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 rounded-full p-3">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">৳2,350</div>
                    <div className="text-sm text-gray-500">Total Outstanding</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">123</div>
                    <div className="text-sm text-gray-500">Paid This Month</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 rounded-full p-3">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-sm text-gray-500">Overdue Fines</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fine Rules Configuration */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Fine Rules Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station Overstay Limit (minutes)</label>
                  <Input type="number" defaultValue="120" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overstay Fine Amount (৳)</label>
                  <Input type="number" defaultValue="50" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (minutes)</label>
                  <Input type="number" defaultValue="15" className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Update Fine Rules</Button>
            </div>

            {/* Fine Management Table */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Fines</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Station</th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Overstay Duration</th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fine Amount</th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { user: "John Doe", station: "Shahbag", duration: "2h 30m", amount: "৳50", date: "Jan 15, 2025", status: "Outstanding" },
                      { user: "Jane Smith", station: "Uttara North", duration: "3h 15m", amount: "৳50", date: "Jan 14, 2025", status: "Paid" },
                      { user: "Mike Johnson", station: "New Market", duration: "1h 45m", amount: "৳50", date: "Jan 13, 2025", status: "Overdue" }
                    ].map((fine, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700 font-medium">{fine.user}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">{fine.station}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">{fine.duration}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">{fine.amount}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">{fine.date}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fine.status === "Paid" ? "bg-green-100 text-green-800" : fine.status === "Overdue" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                            {fine.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="p-2 rounded-md hover:bg-gray-100">
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                            {fine.status === "Outstanding" && (
                              <Button variant="ghost" size="sm" className="p-2 rounded-md hover:bg-gray-100">
                                <Bell className="h-4 w-4 text-gray-600" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Admin Overview */}
            <div className="bg-blue-600 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">MetroHub Admin Dashboard</h2>
              <p className="opacity-90">Manage users, schedules, routes, and system operations</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{normalUsersCount + rapidPassUsersCount}</div>
                    <div className="text-sm text-gray-500">Total Users</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Train className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">24</div>
                    <div className="text-sm text-gray-500">Active Trains</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">18</div>
                    <div className="text-sm text-gray-500">Metro Stations</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">47</div>
                    <div className="text-sm text-gray-500">Active Fines</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent System Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-gray-600" />
                  System Alerts
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-red-900">Service Interruption</div>
                      <div className="text-sm text-red-700">Line 1 experiencing delays due to technical issues</div>
                      <div className="text-xs text-red-600 mt-1">10 minutes ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-yellow-900">Multiple Overstay Fines</div>
                      <div className="text-sm text-yellow-700">5 new fines issued in the last hour</div>
                      <div className="text-xs text-yellow-600 mt-1">45 minutes ago</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md" onClick={() => setActiveSection("users")}>
                    <Users className="h-6 w-6 mb-2 text-gray-600" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md" onClick={() => setActiveSection("schedules")}>
                    <Train className="h-6 w-6 mb-2 text-gray-600" />
                    Update Schedules
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md" onClick={() => setActiveSection("fines")}>
                    <AlertTriangle className="h-6 w-6 mb-2 text-gray-600" />
                    Review Fines
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md">
                    <MessageSquare className="h-6 w-6 mb-2 text-gray-600" />
                    Send Alert
                  </Button>
                </div>
              </div>
            </div>

            {/* Recent User Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent User Registrations</h3>
              <div className="space-y-4">
                {[
                  { name: "John Doe", email: "john@email.com", role: "Regular User", time: "2 hours ago" },
                  { name: "Jane Smith", email: "jane@email.com", role: "Rapid Pass User", time: "4 hours ago" },
                  { name: "Mike Johnson", email: "mike@email.com", role: "Regular User", time: "1 day ago" }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{user.role}</span>
                      <div className="text-xs text-gray-500 mt-1">{user.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}
