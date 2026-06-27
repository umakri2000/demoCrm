import React, { useState } from 'react';
import type { Customer } from '../types/customer';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

interface DeleteConfirmModalProps {
  customer: Customer;
  onClose: () => void;
  onSuccess: () => void;
}

export var DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ customer, onClose, onSuccess }) => {
  var [isDeleting, setIsDeleting] = useState(false);
  var [error, setError] = useState('');

  var handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await axiosInstance.delete(`/customers/${customer.id}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete customer. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Delete Customer</h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 items-start mb-5">
            <div className="p-2.5 bg-red-50 rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-slate-700 text-sm leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-900">{customer.name}</span> from{' '}
                <span className="font-semibold text-slate-900">{customer.company}</span>?
                This action cannot be undone.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
