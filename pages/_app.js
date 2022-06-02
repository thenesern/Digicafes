// Packages or Dependencies
import { SnackbarProvider } from "notistack";
import { SSRProvider } from "react-bootstrap";
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
        id="google-tag-manager"
        dangerouslySetInnerHTML={{
          _html: `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MTSGSVQ');</script>`,
        }}
      ></Script>
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
