import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { ContactUsPage } from './components/ContactUsPage';
import { Dashboard } from './components/Dashboard';
import { CustomersPage } from './components/CustomersPage';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';
import { Loader2 } from 'lucide-react';

var AppContent: React.FC = () => {
  var { isAuthenticated, isLoading } = useAuth();
  var [currentView, setCurrentView] = useState<'login' | 'signup' | 'contact'>('login');
  var [authView, setAuthView] = useState<'dashboard' | 'customers'>('customers'); // Default to customers after login

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AuthenticatedLayout currentView={authView} onNavigate={setAuthView}>
        {authView === 'dashboard' ? <Dashboard /> : <CustomersPage />}
      </AuthenticatedLayout>
    );
  }

  if (currentView === 'signup') {
    return <SignUpPage onNavigateToLogin={() => setCurrentView('login')} />;
  }

  if (currentView === 'contact') {
    return <ContactUsPage onNavigateBack={() => setCurrentView('login')} />;
  }

  return <LoginPage
    onNavigateToSignUp={() => setCurrentView('signup')}
    onNavigateToContact={() => setCurrentView('contact')}
  />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
