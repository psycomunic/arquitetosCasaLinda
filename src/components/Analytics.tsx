import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        fbq: any;
        gtag: any;
    }
}

// Helper to track custom events
export const trackEvent = (eventName: string, params?: any) => {
    if (typeof window !== 'undefined') {
        if (window.fbq) {
            window.fbq('track', eventName, params);
        }
        if (window.gtag) {
            // Map standard Meta events to GA4 if needed, or just log
            console.log('Tracking GA4:', eventName, params);
        }
    }
};

export const Analytics: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // Track PageView on route change
        if (typeof window !== 'undefined') {
            if (window.fbq) window.fbq('track', 'PageView');
            // GA4 automatic page_view usually handles this, but custom logic can go here
        }
    }, [location]);

    return (
        <>
            {/* Meta Pixel Code Placeholder */}
            {/* In production, these scripts should be in index.html or injected here via dangerouslySetInnerHTML if strict CSP allows */}
            {/* 
            <script>
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', 'YOUR_PIXEL_ID');
                fbq('track', 'PageView');
            </script>
            */}
        </>
    );
};
