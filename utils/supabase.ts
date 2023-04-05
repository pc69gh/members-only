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
  }

  const supabase = createClient(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  );

  return supabase;
};

export { getSupabase };
