import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Activity, Target, Trophy, XCircle, Users, PhoneForwarded, Loader2, AlertCircle } from 'lucide-react';

interface DashboardSummary {
  totalLeads: number;
  new: number;
  contacted: number;
  qualified: number;
  won: number;
  lost: number;
}

export var Dashboard: React.FC = () => {
  var { user } = useAuth();
  var [summary, setSummary] = useState<DashboardSummary | null>(null);
  var [isLoading, setIsLoading] = useState(true);
  var [error, setError] = useState('');

  var fetchSummary = async () => {
    setIsLoading(true);
    setError('');
    try {
      var response = await axiosInstance.get('/dashboard/summary');
      setSummary(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  var statCards = [
    { title: 'Total Leads', value: summary?.totalLeads ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { title: 'New Leads', value: summary?.new ?? 0, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { title: 'Contacted Leads', value: summary?.contacted ?? 0, icon: PhoneForwarded, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { title: 'Qualified Leads', value: summary?.qualified ?? 0, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { title: 'Won Leads', value: summary?.won ?? 0, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Lost Leads', value: summary?.lost ?? 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}. Here's what's happening in your pipeline today.</p>
        </div>
        <button
          onClick={fetchSummary}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 rounded-lg shadow-sm transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm font-medium mt-0.5">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          <p className="font-medium">Crunching your numbers...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, idx) => {
              var Icon = card.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
                    <div className={`p-2 rounded-lg ${card.bg} ${card.border} border`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-4xl font-bold text-slate-900">{card.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col justify-center">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Status Breakdown</h2>
            <div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden">
              {summary && summary.totalLeads > 0 ? (
                <>
                  <div style={{ width: `${(summary.new / summary.totalLeads) * 100}%` }} className="bg-indigo-500 h-full" title={`New: ${summary.new}`}></div>
                  <div style={{ width: `${(summary.contacted / summary.totalLeads) * 100}%` }} className="bg-amber-500 h-full" title={`Contacted: ${summary.contacted}`}></div>
                  <div style={{ width: `${(summary.qualified / summary.totalLeads) * 100}%` }} className="bg-purple-500 h-full" title={`Qualified: ${summary.qualified}`}></div>
                  <div style={{ width: `${(summary.won / summary.totalLeads) * 100}%` }} className="bg-emerald-500 h-full" title={`Won: ${summary.won}`}></div>
                  <div style={{ width: `${(summary.lost / summary.totalLeads) * 100}%` }} className="bg-rose-500 h-full" title={`Lost: ${summary.lost}`}></div>
                </>
              ) : (
                <div className="w-full bg-slate-200 h-full"></div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between mt-6 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500"></span>New</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span>Contacted</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span>Qualified</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span>Won</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500"></span>Lost</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
