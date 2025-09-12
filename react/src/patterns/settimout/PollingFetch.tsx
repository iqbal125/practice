import { useEffect, useState } from "react";

function PollingComponent() {
    const [status, setStatus] = useState('pending');
    const [data, setData] = useState(null);

    useEffect(() => {
        let pollInterval: any;

        if (status === 'pending') {
            pollInterval = setInterval(async () => {
                const response = await fetch('/api/job-status');
                const result = await response.json();

                if (result.status === 'completed') {
                    setStatus('completed');
                    setData(result.data);
                    clearInterval(pollInterval);
                }
            }, 2000);
        }

        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [status]);

    return <div>Status: {status}</div>;
}