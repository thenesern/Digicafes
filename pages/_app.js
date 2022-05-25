import "../styles/globals.css";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { StoreProvider } from "../redux/store";
import { SSRProvider } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";

function MyApp({ Component, pageProps }) {
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
