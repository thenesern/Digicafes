import "../styles/globals.css";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { StoreProvider } from "../redux/store";
function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Head>
        <title>Brand Name | Description</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1"
        />
      </Head>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Component {...pageProps} />
      </SnackbarProvider>
    </StoreProvider>
  );
}

export default MyApp;
