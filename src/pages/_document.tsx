// pages/_document.js

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          <meta name="description" content="For all your food needs in Eco." />
          <meta
            name="google-adsense-account"
            content="ca-pub-5536186665437668"
          />
          <link rel="icon" href="/favicon.ico" />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5536186665437668"
            crossOrigin="anonymous"
          ></script>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </Head>
        <body className="h-screen w-screen max-w-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
