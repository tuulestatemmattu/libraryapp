import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePingTest = (url: string) => {
    const [pingResult, setPingResult] = useState<string | null>(null);

    useEffect(() => {
        const fetchPing = async () => {
            try {
                const response = await axios.get(url);
                setPingResult(response.data);
            } catch (err) {
                let message = 'Unknown error'
                if (err instanceof Error) message = err.message;
                setPingResult(message);
            }
        };
        fetchPing();
    }, [url]);

    return pingResult;
};