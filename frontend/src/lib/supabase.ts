import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Supabase client for LA Cityscape.
 *
 * Usage examples:
 *
 * // Fetch permits
 * const { data, error } = await supabase
 *   .from('permits')
 *   .select('*')
 *   .eq('permit_type', 'Building')
 *   .order('issue_date', { ascending: false })
 *   .limit(50);
 *
 * // Fetch planning cases in a council district
 * const { data } = await supabase
 *   .from('planning_cases')
 *   .select('*')
 *   .eq('council_district', '13');
 *
 * // Full-text search across permits
 * const { data } = await supabase
 *   .from('permits')
 *   .select('*')
 *   .ilike('primary_address', '%sunset%');
 *
 * // Auth (future - for Pro subscriptions)
 * const { data, error } = await supabase.auth.signInWithOAuth({
 *   provider: 'google',
 * });
 */
