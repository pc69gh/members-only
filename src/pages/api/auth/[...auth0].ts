// pages/api/auth/[...auth0].js

import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0';
import jwt from 'jsonwebtoken';

const afterCallback = async (_: unknown, __: unknown, session: Session) => {
  const payload = {
    userId: session.user.sub,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  session.user.accessToken = jwt.sign(
    payload,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.SUPABASE_JWT_SECRET!
  );

  return session;
};

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
