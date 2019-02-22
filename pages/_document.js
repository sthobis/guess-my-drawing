import Document, { Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Press+Start+2P"
            rel="stylesheet"
          />
          <link
            href="https://unpkg.com/nes.css@2.0.0/css/nes.min.css"
            rel="stylesheet"
          />
          <style>{`
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      margin: 0;
    }

    a:hover {
      text-decoration: none;
    }
    `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
