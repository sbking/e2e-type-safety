import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Contrail+One&family=Lexend:wght@300;600&family=Source+Code+Pro&display=swap"
        />
      </Head>
      <body className="flex flex-col items-center bg-zinc-100 font-sans text-zinc-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
