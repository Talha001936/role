import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { SessionProvider } from './context/sessioncontext';
import { ToastProvider } from './context/toastcontext';
import { AuthProvider } from './context/authcontext';
<<<<<<< HEAD
import { BillingProvider } from './context/billingcontext';
=======
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
import { DashboardProvider } from './context/dashboardcontext';
import { TaskProvider } from './context/taskcontext';
import { UserProvider } from './context/usercontext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionProvider>
      <ToastProvider>
        <AuthProvider>
<<<<<<< HEAD
          <BillingProvider>
            <DashboardProvider>
              <TaskProvider>
                <UserProvider>
                  <App />
                </UserProvider>
              </TaskProvider>
            </DashboardProvider>
          </BillingProvider>
=======
          <DashboardProvider>
            <TaskProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </TaskProvider>
          </DashboardProvider>
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
        </AuthProvider>
      </ToastProvider>
    </SessionProvider>
  </React.StrictMode>
);