import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://melsspoompxwejtdxmzc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbHNzcG9vbXB4d2VqdGR4bXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxNzAzODUsImV4cCI6MjAzNTc0NjM4NX0.kPDn_-Jmism7oKEGTDaq9QhErl_6h3xsWoR4Fnf-rDg'
const supabase = createClient(supabaseUrl, supabaseKey)

const create = async ({ name, project_id, parent_topic_id, userId }) => {
  const { data: topic, error } = await supabase
    .from('topics')
    .insert({ name, project_id, parent_topic_id, status: 'pending', user_id: userId })
    .select()
    .single()

  if (error) {
    console.log(error)
  }
  return topic
}

const update = async (id, newName) => {
  const { data: topic, error } = await supabase
    .from('topics')
    .update({ name: newName })
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.log(error)
  }
  return topic
}

const deleteTopic = async (topic) => {
  await supabase
    .from('topics')
    .delete()
    .eq('id', topic.id)
}

export default { create, update, deleteTopic }
