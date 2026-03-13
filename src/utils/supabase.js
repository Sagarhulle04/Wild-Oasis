import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://xnfakwrcnflojafwhtdx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZmFrd3JjbmZsb2phZndodGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTA2NzcsImV4cCI6MjA4NzU4NjY3N30.ftLY2uHGz5GxAns8TQoXVx_TyOy6cD4u1jhe9PYuQgU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
