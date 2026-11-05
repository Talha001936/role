import { createContext, useContext, useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import { useToast } from './toastcontext';

const BillingContext = createContext(null);

export const useBilling = () => {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error('useBilling must be used within BillingProvider');
  return ctx;
};

export const BillingProvider = ({ children }) => {
  const toast = useToast();
  const [catalog, setCatalog] = useState(null);
  const [publishableKey, setPublishableKey] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCatalog = useCallback(async () => {
    try {
      const res = await paymentService.getCatalog();
      setCatalog(res.data.catalog);
      setPublishableKey(res.data.publishableKey);
      return res.data.catalog;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load pricing');
      return null;
    }
  }, [toast]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await paymentService.getSummary();
      setSummary(res.data);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  const startSignupCheckout = useCallback(async () => {
    try {
      setLoading(true);
      const res = await paymentService.createSignupCheckout();
      if (res.data.url) window.location.href = res.data.url;
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to start checkout';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const startSubscriptionCheckout = useCallback(async (plan) => {
    try {
      setLoading(true);
      const res = await paymentService.createSubscriptionCheckout(plan);
      if (res.data.url) window.location.href = res.data.url;
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to start subscription';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const openBillingPortal = useCallback(async () => {
    try {
      setLoading(true);
      const res = await paymentService.openBillingPortal();
      if (res.data.url) window.location.href = res.data.url;
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to open billing portal';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getPaymentStatus = useCallback(async () => {
    try {
      const res = await paymentService.getPaymentStatus();
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to fetch status'
      };
    }
  }, []);

  const syncMyPayment = useCallback(async () => {
    try {
      const res = await paymentService.syncMyPayment();
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to sync'
      };
    }
  }, []);

  return (
    <BillingContext.Provider value={{
      catalog, publishableKey, summary, loading,
      fetchCatalog, fetchSummary,
      startSignupCheckout, startSubscriptionCheckout,
      openBillingPortal,
      getPaymentStatus, syncMyPayment
    }}>
      {children}
    </BillingContext.Provider>
  );
};