// Packages or Dependencies
import { SnackbarProvider } from "notistack";
import { SSRProvider } from "react-bootstrap";
import { useEffect } from "react";
import { useRouter } from "next/router";
import * as ga from "../lib/google-analytics";
// Head
import Head from "next/head";
// Styles
import "../styles/globals.css";
// Store
import { StoreProvider } from "../redux/store";
// Translation
import useTranslation from "next-translate/useTranslation";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  // Translation
  const { t } = useTranslation();

  return (
    <StoreProvider>
      <Head>
        <title>{t("common:head")}</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1"
        />
        <meta
          name="keywords"
          content="Dijital Menü, QR Menü, Menü, Cafe, Kafe, Restoran, Restaurant, Restoran Menü, Cafe Menü, Dijital QR Menü, digicafes.com, DigiCafes"
        />
        <meta name="description" content={t("common:head")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
      ></Script>
      <Script
        id="google-analytics-script"
        strategy="afterInteractive"
      >{`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${process.env.GA_TRACKING_ID}');`}</Script>

      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <SSRProvider>
          <Component {...pageProps} />
        </SSRProvider>
      </SnackbarProvider>
    </StoreProvider>
  );
}

export default MyApp;
