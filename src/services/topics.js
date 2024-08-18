import { supabase } from "../lib/initSupabase"

const getAllByProject = async (projectId) => {
  let { data: topics, error } = await supabase
    .from('topics')
    .select()
    .eq('project_id', projectId)

  if (topics) {
    return topics
  }

  if (error) {
    console.log(error)
  }
}

const create = async (topicToCreate) => {
  const { data: topic, error } = await supabase
    .from('topics')
    .insert(topicToCreate)
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

const updateStatus = async (id, newStatus) => {
  const { data: topic, error } = await supabase
    .from('topics')
    .update({ status: newStatus })
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

const deleteTopics = async (projectId) => {
  await supabase
    .from('topics')
    .delete()
    .eq('project_id', projectId)
}

export default {
  getAllByProject,
  create,
  update,
  updateStatus,
  deleteTopic,
  deleteTopics
}
