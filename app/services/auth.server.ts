import type { User } from '@prisma/client';
import { Authenticator } from 'remix-auth';

import type { GoogleProfile } from '~/services/auth.googleStrategy';
import { GoogleStrategy } from '~/services/auth.googleStrategy';
import { createUser, getUserByEmail } from '~/services/dao/users';
import { sessionStorage } from '~/services/session.server';

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

if (!clientID) {
  throw new Error('CLIENT_ID env variable must be set');
}

if (!clientSecret) {
  throw new Error('CLIENT_SECRET env variable must be set');
}

export type AuthenticatedUser = {
  record: User;
  googleProfile: GoogleProfile;
};

export const authenticator = new Authenticator<AuthenticatedUser>(
  sessionStorage,
);

authenticator.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async ({ profile }) => {
      const { email } = profile._json;
      const user = (await getUserByEmail(email)) || (await createUser(email));

      if (!user) {
        throw new Error('User record is not found');
      }

      return { record: user, googleProfile: profile };
    },
  ),
  'google-auth',
);
