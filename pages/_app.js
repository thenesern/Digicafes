import "../styles/globals.css";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { StoreProvider } from "../redux/store";
import { SSRProvider } from "react-bootstrap";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Head>
        <title>
          Digicafes | Kafe, Restoran ve Bahçeler için Dijital Menü çözümleri.
        </title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1"
        />
        <meta
          name="keywords"
          content="Dijital Menü, QR Menü, Menü, Cafe, Restoran, Restoran Menü, Cafe Menü, Dijital QR Menü, digicafes.com, DigiCafes"
        />
        <meta
          name="description"
          content="Digicafes | Kafe, Restoran ve Bahçeler için Dijital Menü çözümleri."
        />
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
