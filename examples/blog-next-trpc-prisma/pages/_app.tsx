import type { AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import "prism-themes/themes/prism-one-dark.css";

import "../styles/globals.css";
import { trpc } from "../lib/trpc";
import { NavBar } from "../components/NavBar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Example Blog</title>
      </Head>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
};

export default trpc.withTRPC(MyApp);
