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
      subTopics: removeTopicInNestedTopics(topic.subTopics, topicToDelete)
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
    } else if (topic.subTopics) {
      // Recursively update subtopics
      return { ...topic, subTopics: updateTopicInNestedTopics(topic.subTopics, topicToUpdate) }
    }
    return topic
  })
}

export const deleteTopic = (topic) => {
  return async (dispatch, getState) => {
    const projects = getState().projects
    if (window.confirm('Delete ' + topic.name)) {
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
    const projects = getState().projects
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
    const projects = getState().projects
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

export const createTopic = (topic, session) => {
  return async dispatch => {
    const savedTopic = await topicService
      .create({ ...topic, userId: session?.user?.id })
    const projects = await projectService.getAllWithReference()
    const transformedProjects = transformProjects(projects)
    const updatedProjects = await updateProgress(transformedProjects, savedTopic.project_id)
    dispatch(setProjects(updatedProjects))
  }
}

export const { setTopics } = topicSlice.actions
export default topicSlice.reducer
