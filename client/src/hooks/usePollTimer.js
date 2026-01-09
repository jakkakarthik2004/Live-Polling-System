import { useState, useEffect } from 'react';

export const usePollTimer = (startedAt, duration) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!startedAt || !duration) {
            setTimeLeft(0);
            return;
        }

        const calculateTime = () => {
            const start = new Date(startedAt).getTime();
            if (isNaN(start)) return 0;
            const now = new Date().getTime();
            const elapsed = Math.floor((now - start) / 1000);
            return Math.max(duration - elapsed, 0);
        };

        const interval = setInterval(() => {
            const remaining = calculateTime();
            setTimeLeft(remaining);

            if (remaining === 0) {
                clearInterval(interval);
            }
        }, 1000);

        // Initial calculation
        setTimeLeft(calculateTime());

        return () => clearInterval(interval);
    }, [startedAt, duration]);

    return timeLeft;
};
