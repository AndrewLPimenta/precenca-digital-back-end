
// Supabase Client com importação ES6
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xtplfshexmgqrtdqddqy.supabase.co', // Substitua com a URL do Supabase
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0cGxmc2hleG1ncXJ0ZHFkZHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNDUzNzQsImV4cCI6MjA1MzYyMTM3NH0.ep2xaMf1YtzKpyCfn3yX6jwoiXg3p6TS3C5S6_CTnCo'  // Substitua com a chave do Supabase
);

export default supabase;
