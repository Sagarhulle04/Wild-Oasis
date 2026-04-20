import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://yoxzrsyajbyxyyfdupcy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlveHpyc3lhamJ5eHl5ZmR1cGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDE1NjMsImV4cCI6MjA5MjI3NzU2M30._de1kFATLKwVf_U7C1iTnpNDzbetIfxv-vSRXJLLfSY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
