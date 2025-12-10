import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY/SERVICE_ROLE_KEY/ANON_KEY are required');
}

// Heuristic: service role keys contain "service_role" while anon keys do not.
export const isServiceRole = Boolean(supabaseKey && supabaseKey.includes('service_role'));

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
