import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import FullScreenLoader from './components/common/FullScreenLoader';

const antTheme = {
  token: {
    colorPrimary: '#0f172a',
    colorPrimaryHover: '#1e293b',
    colorLink: '#2563eb',
    colorLinkHover: '#1d4ed8',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
};

const AppContent = () => {
  const { loading: authLoading, token } = useAuth();
  const { loading: settingsLoading } = useSettings();
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    // When initial checks complete, set bootReady to true
    if (!authLoading && !settingsLoading) {
      setBootReady(true);
    }
  }, [authLoading, settingsLoading]);

  // Case 1: Restoring an existing administrator session
  if (token && authLoading) {
    return (
      <FullScreenLoader
        message="Restoring administrator session..."
        subtext="Verifying credentials"
      />
    );
  }

  // Case 2: Initial application boot and settings load
  if (!bootReady && (settingsLoading || authLoading)) {
    return (
      <FullScreenLoader
        message="Loading AHMAD STORE..."
        subtext="Preparing your shopping experience"
      />
    );
  }

  return <AppRoutes />;
};

const App = () => {
  return (
    <ConfigProvider theme={antTheme}>
      <BrowserRouter>
        <SettingsProvider>
          <AuthProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </AuthProvider>
        </SettingsProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;