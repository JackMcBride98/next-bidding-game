import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';
import Head from 'next/head';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gtag.GA_TRACKING_ID}', {
          page_path: window.location.pathname,
        });
      `,
        }}
      />
      <Head>
        <meta
          name="google-site-verification"
          content="VZGnEz3QRBdhp6brONj_ezQLHEhN6mkzvBAN80-kugQ"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
