import { db } from '~/utils/db.server';

export const createUser = (email: string) =>
  db.user.create({
    data: {
      email,
      provider: 'google',
    },
  });

export const getUserByEmail = (email: string) =>
  db.user.findUnique({
    where: { email },
  });
