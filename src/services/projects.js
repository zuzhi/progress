import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = 'https://melsspoompxwejtdxmzc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbHNzcG9vbXB4d2VqdGR4bXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxNzAzODUsImV4cCI6MjAzNTc0NjM4NX0.kPDn_-Jmism7oKEGTDaq9QhErl_6h3xsWoR4Fnf-rDg'
const supabase = createClient(supabaseUrl, supabaseKey)

const getAll = async () => {
  let { data: projects, error } = await supabase
    .from('project')
    .select('*')

  if (projects) {
    return projects
  }

  if (error) {
    console.log(error)
  }
}

const create = async ({ name }) => {
  const { data, error } = await supabase
    .from('project')
    .insert({ name: name })
    .select()
  if (error) {
    console.log(error)
  }
  return data[0]
}

const update = async (id, newName) => {
  const { data, error } = await supabase
    .from('project')
    .update({ name: newName })
    .eq('id', id)
    .select()
  if (error) {
    console.log(error)
  }
  return data[0]
}

const deleteProject = async (project) => {
  await supabase
    .from('project')
    .delete()
    .eq('id', project.id)
}

export default { getAll, create, update, deleteProject }
