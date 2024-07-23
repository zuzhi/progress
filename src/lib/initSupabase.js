import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://melsspoompxwejtdxmzc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbHNzcG9vbXB4d2VqdGR4bXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxNzAzODUsImV4cCI6MjAzNTc0NjM4NX0.kPDn_-Jmism7oKEGTDaq9QhErl_6h3xsWoR4Fnf-rDg'
export const supabase = createClient(supabaseUrl, supabaseKey)
