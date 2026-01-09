import { useState, useEffect } from 'react';

export const usePollDetails = (pollId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!pollId) return;

        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/polls/${pollId}`);
                if (!res.ok) throw new Error('Failed to fetch details');
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [pollId]);

    return { data, loading, error };
};
