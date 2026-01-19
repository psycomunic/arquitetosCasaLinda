import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = 'https://sfpzxxtptrlttvzymqto.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcHp4eHRwdHJsdHR2enltcXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjUyMDEsImV4cCI6MjA4NDM0MTIwMX0.Nsydjy1Tt2uRcFY4vLi3x1iGLBwytzaLWwgUqoGoVZY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
