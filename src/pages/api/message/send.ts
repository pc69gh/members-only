import { getSession, Session } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { getSupabase } from 'utils/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = (await getSession(req, res)) as Session;
  const supabase = getSupabase(user.accessToken);
  const { data, error } = await supabase.from('messages').insert([
    {
      content: req.body.message,
      user_id: user.sub,
      address: user.nickname,
    },
  ]);
  if (error) {
    res.status(500).json(error);
  } else {
    res.status(200).json(data);
  }
}
