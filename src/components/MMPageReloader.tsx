import { useLocation } from "react-router-dom";
import { useEffect } from 'react';

function MMPageReloader() {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            window.location.reload();
        }
    }, [location]);

    return null;
}

export default MMPageReloader;