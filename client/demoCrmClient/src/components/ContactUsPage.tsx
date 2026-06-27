import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Mail, Phone, Building2, User, Globe, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

interface ContactUsPageProps {
  onNavigateBack: () => void;
}

export var ContactUsPage: React.FC<ContactUsPageProps> = ({ onNavigateBack }) => {
  var [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: '',
    status: '',
    notes: ''
  });

  var [errors, setErrors] = useState<Record<string, string>>({});
  var [isSubmitting, setIsSubmitting] = useState(false);
  var [submitSuccess, setSubmitSuccess] = useState(false);
  var [submitError, setSubmitError] = useState('');

  var statusOptions = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];

  var validateForm = () => {
    var newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Valid phone number is required';
      isValid = false;
    }

    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  var handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    var { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  var handleReset = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      source: '',
      status: '',
      notes: ''
    });
    setErrors({});
    setSubmitError('');
    setSubmitSuccess(false);
  };

  var handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.post('/customersdata', formData);
      setSubmitSuccess(true);
      handleReset(); // Optional: reset form on success
      setSubmitSuccess(true); // set it back to true since reset clears it
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onNavigateBack}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>

        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 overflow-hidden">
          <div className="bg-blue-600 px-8 py-10 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">Contact Us</h2>
            <p className="text-blue-100 mt-2 text-sm max-w-lg mx-auto">
              Interested in our  CRM? Drop your details below and our sales team will reach out to you shortly.
            </p>
          </div>

          <div className="p-8">
            {submitSuccess && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 text-sm">Successfully Submitted!</h3>
                  <p className="text-green-700 text-sm mt-1">Thank you for getting in touch. We have received your information and will contact you soon.</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 text-sm">Submission Error</h3>
                  <p className="text-red-700 text-sm mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 block w-full rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} sm:text-sm px-3 py-2.5 outline-none transition-colors`}
                      placeholder="Jane Doe"
                    />
                  </div>
                  {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`pl-10 block w-full rounded-lg border ${errors.company ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} sm:text-sm px-3 py-2.5 outline-none transition-colors`}
                      placeholder="Acme Corp"
                    />
                  </div>
                  {errors.company && <p className="mt-1.5 text-sm text-red-600">{errors.company}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 block w-full rounded-lg border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} sm:text-sm px-3 py-2.5 outline-none transition-colors`}
                      placeholder="jane@company.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`pl-10 block w-full rounded-lg border ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} sm:text-sm px-3 py-2.5 outline-none transition-colors`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Source */}
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-slate-700 mb-1">Source *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      className={`pl-10 block w-full rounded-lg border ${errors.source ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} sm:text-sm px-3 py-2.5 outline-none transition-colors`}
                      placeholder="e.g. Google, Referral"
                    />
                  </div>
                  {errors.source && <p className="mt-1.5 text-sm text-red-600">{errors.source}</p>}
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border ${errors.status ? 'border-red-300 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'} sm:text-sm px-3 py-2.5 outline-none transition-colors`}
                  >
                    <option value="" disabled>Select a status</option>
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.status && <p className="mt-1.5 text-sm text-red-600">{errors.status}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2.5 outline-none transition-colors resize-y"
                  placeholder="Tell us a little bit about your needs..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 focus:ring-4 focus:ring-blue-100 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-semibold hover:bg-slate-200 active:bg-slate-300 focus:ring-4 focus:ring-slate-100 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
