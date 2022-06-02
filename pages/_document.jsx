import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="tr">
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-MTSGSVQ"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
