import { createSlice } from "@reduxjs/toolkit"
import topicService from '../services/topics'
import projectService from '../services/projects'
import { setProjects, transformProjects } from "./projectReducer"

const topicSlice = createSlice({
  name: 'topics',
  initialState: [],
  reducers: {
    setTopics(state, action) {
      return action.payload
    }
  }
})

const removeTopicInNestedTopics = (topics, topicToDelete) => {
  return topics
    .filter(topic => topic.id !== topicToDelete.id)
    .map(topic => ({
      ...topic,
      topics: removeTopicInNestedTopics(topic.topics, topicToDelete)
    }))
}

const updateProgress = async (projects, projectId) => {
  const topics = await topicService.getAllByProject(projectId)
  const project = await projectService.getOne(projectId)
  const finished = topics.filter(topic => topic.status === 'done' || topic.status === 'skip' || topic.status === 'skim')
  const newProgress = topics.length === 0 ? 0 : Math.floor(finished.length / topics.length * 100)
  await projectService.updateProgress(projectId, newProgress)
  const newProject = {
    ...project,
    progress: newProgress
  }
  const newProjects = projects.map(project => ({
    ...project,
    progress: project.id === newProject.id ? newProject.progress : project.progress
  }))
  return newProjects
}

const updateTopicInNestedTopics = (topics, topicToUpdate) => {
  return topics.map(topic => {
    if (topic.id === topicToUpdate.id) {
      // Update the topic properties
      return { ...topic, ...topicToUpdate }
    } else if (topic.topics) {
      // Recursively update subtopics
      return { ...topic, topics: updateTopicInNestedTopics(topic.topics, topicToUpdate) }
    }
    return topic
  })
}

export const deleteTopic = (topic) => {
  return async (dispatch, getState) => {
    const projects = getState().projects.list
    if (window.confirm(`delete ${topic.name}?`)) {
      await topicService.deleteTopic(topic)
      const newProjects = projects.map(project => ({
        ...project,
        topics: removeTopicInNestedTopics(project.topics, topic)
      }))
      const updatedProjects = await updateProgress(newProjects, topic.project_id)
      dispatch(setProjects(updatedProjects))
    }
  }
}

export const updateTopic = (topic) => {
  return async (dispatch, getState) => {
    const projects = getState().projects.list
    const updatedTopic = await topicService
      .update(topic.id, topic.name)
    const newProjects = projects.map(project => ({
      ...project,
      topics: updateTopicInNestedTopics(project.topics, updatedTopic)
    }))
    dispatch(setProjects(newProjects))
  }
}

export const updateTopicStatus = (topic, status) => {
  return async (dispatch, getState) => {
    const projects = getState().projects.list
    const updatedTopic = await topicService
      .updateStatus(topic.id, status)
    const newProjects = projects.map(project => ({
      ...project,
      topics: updateTopicInNestedTopics(project.topics, updatedTopic)
    }))
    const updatedProjects = await updateProgress(newProjects, topic.project_id)
    dispatch(setProjects(updatedProjects))
  }
}

export const createTopic = (topic, userId) => {
  return async dispatch => {
    const savedTopic = await topicService
      .create({
        ...topic,
        status: 'pending',
        user_id: userId
      })
    const projects = await projectService.getAllWithReference()
    const transformedProjects = transformProjects(projects)
    const updatedProjects = await updateProgress(transformedProjects, savedTopic.project_id)
    dispatch(setProjects(updatedProjects))
  }
}

export const getAllTopicsByProjectId = (projectId) => {
  return async dispatch => {
    const topics = await topicService.getAllByProject(projectId)
    dispatch(setTopics(topics))
  }
}

export const initProject = (project, newTopics, userId) => {
  // delete all current topics and add new
  return async dispatch => {
    // delete topics
    await topicService.deleteTopics(project.id)

    // save new topics, use indentTracker to keep track of parent_topic_id
    let indentTracker = []
    for (const topic of newTopics) {
      if (topic.class === null) {
        const topicToCreate = {
          name: topic.name,
          project_id: project.id,
          status: 'pending',
          user_id: userId
        }
        const created = await topicService.create(topicToCreate)
        indentTracker = []
        indentTracker[0] = created.id
      } else {
        const indentLevel = parseInt(topic.class.split('-').pop(), 10)
        const parent_topic_id = indentTracker[indentLevel - 1]
        const topicToCreate = {
          name: topic.name,
          project_id: project.id,
          parent_topic_id: parent_topic_id,
          status: 'pending',
          user_id: userId
        }
        const created = await topicService.create(topicToCreate)
        indentTracker[indentLevel] = created.id
      }
    }
    const projects = await projectService.getAllWithReference()
    const transformedProjects = transformProjects(projects)
    dispatch(setProjects(transformedProjects))
  }
}

export const { setTopics } = topicSlice.actions
export default topicSlice.reducer
