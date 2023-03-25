import type { LoaderFunction } from '@remix-run/node';
import { Form, useTransition } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });
  return null;
};

const Login = () => {
  const transition = useTransition();

  return (
    <div className="hero min-h-screen bg-gradient-to-bl from-white to-gray-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-7xl font-bold text-accent">Shalfeii</h1>
          <h3 className="text-7xl font-bold text-accent-focus">taxes</h3>
          <p className="py-12 font-medium text-warning-content tracking-wider">
            Simple tool for keeping track of your taxes.
          </p>
          <Form action="/auth/google" method="post">
            <button
              disabled={!!transition.submission}
              className={`btn btn-wide btn-outline btn-primary-focus ${
                transition.submission ? 'loading' : ''
              }`}
            >
              Let's Go
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
