import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VehicleDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ name: '', status: 'active' });
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/vehicles', newVehicle);
      setNewVehicle({ name: '', status: 'active' });
      setIsAddingVehicle(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/vehicles/${id}`, {
        status: newStatus
      });
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Dashboard</h1>
            <button
              onClick={() => setIsAddingVehicle(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Vehicle
            </button>
          </div>

          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500">Total Vehicles</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {vehicles.length}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500">Active Vehicles</dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600">
                  {vehicles.filter(v => v.status === 'active').length}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500">In Maintenance</dt>
                <dd className="mt-1 text-3xl font-semibold text-yellow-600">
                  {vehicles.filter(v => v.status === 'maintenance').length}
                </dd>
              </div>
            </div>
          </div>

          {/* Add Vehicle Modal */}
          {isAddingVehicle && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4">Add New Vehicle</h2>
                <form onSubmit={handleAddVehicle} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle Name
                    </label>
                    <input
                      type="text"
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={newVehicle.status}
                      onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingVehicle(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Add Vehicle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Vehicles Section */}
          <div className="mt-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                  {/* Vehicle Names Column */}
                  <div className=''>
                    <dt className="text-sm font-medium text-gray-500">Vehicle Names</dt>
                    <div className="mt-6 space-y-8">
                      {vehicles.map((vehicle) => (
                        <dd key={vehicle._id} className="text-sm font-medium text-gray-900">
                          {vehicle.name}
                        </dd>
                      ))}
                    </div>
                  </div>

                  {/* Status Column */}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <div className="mt-6 space-y-6">
                      {vehicles.map((vehicle) => (
                        <dd key={vehicle._id}>
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${getStatusColor(vehicle.status)}`}>
                            {vehicle.status}
                          </span>
                        </dd>
                      ))}
                    </div>
                  </div>

                  {/* Last Updated Column */}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <div className="mt-6 space-y-8">
                      {vehicles.map((vehicle) => (
                        <dd key={vehicle._id} className="text-sm text-gray-500">
                          {new Date(vehicle.updatedAt).toLocaleString()}
                        </dd>
                      ))}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Actions</dt>
                    <div className="mt-6 space-y-2">
                      {vehicles.map((vehicle) => (
                        <dd key={vehicle._id}>
                          <select
                            value={vehicle.status}
                            onChange={(e) => handleUpdateStatus(vehicle._id, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="active">Active</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </dd>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDashboard;