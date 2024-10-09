import React from 'react';
import type { AppProps } from 'next/app';
import TriggerPriceAlerts from './Admin/Notificationservice/PriceAlerts/TriggerPriceAlerts';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <TriggerPriceAlerts />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;