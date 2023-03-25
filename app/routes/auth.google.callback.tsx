import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = ({ request }) =>
  authenticator.authenticate('google-auth', request, {
    successRedirect: '/',
    failureRedirect: '/',
  });
