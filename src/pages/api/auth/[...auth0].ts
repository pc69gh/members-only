// pages/api/auth/[...auth0].js

import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0';
import jwt from 'jsonwebtoken';

import { getTokenBalance } from '@/lib/zdk';

const afterCallback = async (_: unknown, __: unknown, session: Session) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24;

  const { tokens } = await getTokenBalance(session.user.nickname, [
    '0x0ef7ba09c38624b8e9cc4985790a2f5dbfc1dc42',
  ]);

  const hasToken = tokens.nodes.length > 0;

  /*
    TODO store custom claim with reference to held tokens
    this current solution works for now because we're only servicing one chat room
    and so we can block access to the bread chat table based on the existince of 
    a userId claim in RLS. Once we have multiple token gated features, we'll need
    to store the token id in the claim so we can check against the token id in the
    RLS policy to provide granular access control. I'm refraining from doing this
    in Auth0 (https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow) 
    in case we want to switch to using SIWE directly in the future.
  */

  const payload = {
    ...(hasToken && {
      sub: session.user.sub,
      role: 'authenticated',
      userId: session.user.sub,
    }),
    exp,
    iat,
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
