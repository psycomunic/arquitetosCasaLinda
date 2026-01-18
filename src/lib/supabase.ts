import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = 'https://sfpzxxtptrlttvzymqto.supabase.co';
const supabaseAnonKey = 'sbp_5bd5b28cc74c63aa9bf671e623fc05473b686a9b';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
