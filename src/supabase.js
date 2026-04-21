import { createClient } from '@supabase/supabase-js'

function getRequiredEnv(name) {
    const value = import.meta.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

const supabaseUrl = getRequiredEnv('VITE_SUPABASE_URL')
const supabaseAnonKey = getRequiredEnv('VITE_SUPABASE_ANON_KEY')

export const supabaseStorageBucket = getRequiredEnv('VITE_SUPABASE_STORAGE_BUCKET')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
