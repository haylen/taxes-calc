import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import styles from './styles/app.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Shalfeii',
  viewport: 'width=device-width,initial-scale=1',
});

export const links = () => [{ rel: 'stylesheet', href: styles }];

export const App = () => (
  <html lang="en">
    <head>
      <Meta />
      <Links />
    </head>
    <body>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </body>
  </html>
);

export default App;
