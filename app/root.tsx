import type {
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import customCSS from 'app/styles/custom.css';

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: customCSS },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Sora STEM Journal",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div id="header">
          <Link to="/articles" prefetch="intent">
            <img className="soraLogo" src="https://cdn.discordapp.com/attachments/895795779439038464/987187170336985108/GRAY_SORA_LOGO.png" />
          </Link>
  
          <Link to="/articles/new" style={{padding: '20px'}}> 
            <button className="submitButton" type="submit">New Article</button>
          </Link>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
