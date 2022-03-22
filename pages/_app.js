import Navbar from "../components/NavBar/Navbar";
import "../styles/globals.css";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { StoreProvider } from "../redux/store";
import { useRouter } from "next/router";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <StoreProvider>
        <Head>
          <title>Brand Name | Description</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Component {...pageProps} />
        </SnackbarProvider>
      </StoreProvider>
    </>
  );
}

export default MyApp;
