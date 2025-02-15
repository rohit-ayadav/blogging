// _app.tsx
import { useEffect } from 'react';
import Script from 'next/script';

import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
        gtag('js', new Date());
        gtag('config', 'G-B6BX5NBWH5');  
    }, []);

    return (
        <>
            {/* Google Analytics Script */}
            <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-B6BX5NBWH5"
            />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
