import { useState, useEffect, useCallback } from 'react';

export const useRepoData = (fetcherFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherFn();
      setData(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err.message || 'An error occurred fetching data');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, source, loading, error, refetch: fetchData };
};
