import { createClient } from "@supabase/supabase-js";

// We require these environment variables to be set for the sync engine to work.
// If they are missing, the client will be null and the sync engine will gracefully fail locally.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// The types corresponding to our SQL schema
export interface SupabaseUser {
  id?: string;
  email: string;
  fit_score: number;
  streak: number;
  payload: any;
  created_at?: string;
  last_checkin_at?: string | null;
}
