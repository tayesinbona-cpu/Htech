import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://soyakvlfqrhjnecyscxy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1GSfqmi0JtuEtdZ7u75c1w_OmYDrdsO";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
