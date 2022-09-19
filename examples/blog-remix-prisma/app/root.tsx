import type {
  ErrorBoundaryComponent,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import type { CatchBoundaryComponent } from "@remix-run/react/dist/routeModules";

import styles from "~/styles/app.css";

import { NavBar } from "./components/NavBar";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Contrail+One&family=Lexend:wght@300;600&family=Source+Code+Pro&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Example Blog",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col items-center bg-stone-100 font-sans text-stone-900">
        <NavBar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();

  return (
    <html lang="en">
      <head>
        <title>{caught.statusText}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar />
        <h1>
          {caught.status} {caught.data}
        </h1>
        <Scripts />
      </body>
    </html>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  return (
    <html>
      <head>
        <title>Something went wrong!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar />
        <h1>Something went wrong!</h1>
        <Scripts />
      </body>
    </html>
  );
};
