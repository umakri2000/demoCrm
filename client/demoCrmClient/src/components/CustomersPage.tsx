import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { CustomerEditModal } from './CustomerEditModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import type { Customer } from '../types/customer';
import { Edit2, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export var CustomersPage: React.FC = () => {
  var [customers, setCustomers] = useState<Customer[]>([]);
  var [isLoading, setIsLoading] = useState(true);
  var [error, setError] = useState('');
  var [successMessage, setSuccessMessage] = useState('');

  var [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  var [isModalOpen, setIsModalOpen] = useState(false);

  var [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  var fetchCustomers = async () => {
    setIsLoading(true);
    setError('');
    try {
      var response = await axiosInstance.get('/customers');
      setCustomers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  var handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  var handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  var handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  var handleDeleteClose = () => {
    setCustomerToDelete(null);
  };

  var handleDeleteSuccess = () => {
    setSuccessMessage('Customer deleted successfully.');
    fetchCustomers();
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  var getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'contacted': return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
      case 'qualified': return 'bg-purple-50 text-purple-700 ring-purple-600/20';
      case 'won': return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'lost': return 'bg-red-50 text-red-700 ring-red-600/20';
      default: return 'bg-slate-50 text-slate-700 ring-slate-600/20';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your leads and customer relationships.</p>
        </div>
        <button
          onClick={fetchCustomers}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 rounded-lg shadow-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm font-medium mt-0.5">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm font-medium mt-0.5">{error}</p>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 whitespace-nowrap">Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Company</th>
                <th className="px-6 py-4 whitespace-nowrap">Contact</th>
                <th className="px-6 py-4 whitespace-nowrap">Source</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                      <p>Loading customers...</p>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-500">No customers found.</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(customer.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">{customer.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-slate-900">{customer.email}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{customer.phone}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">{customer.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(customer)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(customer)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedCustomer && (
        <CustomerEditModal
          customer={selectedCustomer}
          onClose={handleCloseModal}
          onSuccess={fetchCustomers}
        />
      )}

      {customerToDelete && (
        <DeleteConfirmModal
          customer={customerToDelete}
          onClose={handleDeleteClose}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};
