export const SUPABASE_URL = "https://dugyrawoqiztodugzwmi.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Z3lyYXdvcWl6dG9kdWd6d21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDA2OTUsImV4cCI6MjA5NzQ3NjY5NX0.A_HQwb6IXldqsoEYab56Nng2pSytFSi6OTZbhUNIeHc";

export const PROFILE_KEY = "shared";

export const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export function requireSupabase() {
  if (!supabaseClient) throw new Error("Supabase client is not available. Check the CDN script in index.html.");
  return supabaseClient;
}
