import Head from "next/head";
import Menu from "../components/Menu";

export default () => (
  <main>
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
    <Menu />
  </main>
);
