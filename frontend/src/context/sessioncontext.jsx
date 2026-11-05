import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SessionContext = createContext(null);

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
};

const STORAGE_KEY = 'app_session';

export const SessionProvider = ({ children }) => {
  const [session, setSessionState] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const setSession = useCallback((data) => {
    setSessionState(data);
    try {
      if (data) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {  }
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {  }
  }, []);

  
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        setSessionState(e.newValue ? JSON.parse(e.newValue) : null);
      } catch { }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};