import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { SessionProvider } from './context/sessioncontext';
import { ToastProvider } from './context/toastcontext';
import { AuthProvider } from './context/authcontext';
import { DashboardProvider } from './context/dashboardcontext';
import { TaskProvider } from './context/taskcontext';
import { UserProvider } from './context/usercontext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionProvider>
      <ToastProvider>
        <AuthProvider>
          <DashboardProvider>
            <TaskProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </TaskProvider>
          </DashboardProvider>
        </AuthProvider>
      </ToastProvider>
    </SessionProvider>
  </React.StrictMode>
);