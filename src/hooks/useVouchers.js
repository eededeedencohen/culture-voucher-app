import { useState, useEffect, useCallback } from 'react';
import { voucherAPI } from '../services/api';

export function useVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await voucherAPI.getAll();
      setVouchers(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בטעינת שוברים');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  return { vouchers, loading, error, refetch: fetchVouchers };
}

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await voucherAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
