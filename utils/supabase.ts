/* eslint-disable @typescript-eslint/no-non-null-assertion */
// utils/supabase.js

import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSupabase = (access_token: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {};

  if (access_token) {
    options.global = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    options.realtime = {
      headers: {
        apikey: access_token, // custom token with 'authenticated' role signed with jwt secret
      },
      params: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // supabase anon key
      },
    };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  );

  return supabase;
};

export { getSupabase };
