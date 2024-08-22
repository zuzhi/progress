import { supabase } from "../lib/initSupabase"

const getAll = async () => {
  let { data: projects, error } = await supabase
    .from('projects')
    .select('*')

  if (projects) {
    return projects
  }

  if (error) {
    console.log(error)
  }
}

const getOne = async (projectId) => {
  let { data: project, error } = await supabase
    .from('projects')
    .select()
    .eq('id', projectId)
    .single()

  if (project) {
    return project
  }

  if (error) {
    console.log(error)
  }
}

const getAllWithReference = async () => {
  let { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      progress,
      topics (
        id,
        project_id,
        parent_topic_id,
        name,
        status
      )
    `)
    .eq('status', 'normal')
    .order('id', { ascending: true })
    .order('id', { ascending: true, referencedTable: 'topics' })

  if (projects) {
    return projects
  }

  if (error) {
    console.log(error)
  }
}

const getArchivesWithReference = async () => {
  let { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      progress,
      topics (
        id,
        project_id,
        parent_topic_id,
        name,
        status
      )
    `)
    .eq('status', 'archived')
    .order('id', { ascending: true })
    .order('id', { ascending: true, referencedTable: 'topics' })

  if (projects) {
    return projects
  }

  if (error) {
    console.log(error)
  }
}

const create = async ({ name, userId }) => {
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      name: name,
      user_id: userId,
      status: 'normal'
    })
    .select()
    .single()

  if (error) {
    console.log(error)
  }
  return project
}

const update = async (id, newName) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ name: newName })
    .eq('id', id)
    .select()
  if (error) {
    console.log(error)
  }
  return data[0]
}

const updateProgress = async (id, newProgress) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ progress: newProgress })
    .eq('id', id)
    .select()
  if (error) {
    console.log(error)
  }
  return data[0]
}

const deleteProject = async (project) => {
  await supabase
    .from('projects')
    .delete()
    .eq('id', project.id)
}

const archiveProject = async (project) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ status: 'archived' })
    .eq('id', project.id)
    .select()
  if (error) {
    console.log(error)
  }
  return data[0]
}

const unarchiveProject = async (project) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ status: 'normal' })
    .eq('id', project.id)
    .select()
  if (error) {
    console.log(error)
  }
  return data[0]
}

export default {
  getAll,
  getOne,
  getAllWithReference,
  getArchivesWithReference,
  create,
  update,
  updateProgress,
  deleteProject,
  archiveProject,
  unarchiveProject
}
