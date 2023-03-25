import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  const currentYear = new Date().getFullYear();

  return redirect(`/years/${currentYear}/quarters/1`);
};
