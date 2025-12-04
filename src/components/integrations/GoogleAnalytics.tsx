import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

interface GoogleAnalyticsProps {
    measurementId: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
    const location = useLocation();

    useEffect(() => {
        if (!measurementId) return;

        // Initialize GA script
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        script.async = true;
        document.head.appendChild(script);

        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
        gtag('js', new Date());
        gtag('config', measurementId);

        window.gtag = gtag;

        return () => {
            document.head.removeChild(script);
        };
    }, [measurementId]);

    // Track page views
    useEffect(() => {
        if (!window.gtag || !measurementId) return;

        window.gtag('config', measurementId, {
            page_path: location.pathname + location.search,
        });
    }, [location, measurementId]);

    return null;
}
