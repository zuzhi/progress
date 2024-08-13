import { createSlice } from "@reduxjs/toolkit"
import projectService from '../services/projects'

const projectSlice = createSlice({
  name: 'projects',
  initialState: [],
  reducers: {
    setProjects(state, action) {
      return action.payload
    }
  }
})

export const { setProjects } = projectSlice.actions

export const transformProjects = (projects) => {
  return projects.map(project => ({
    ...project,
    topics: nestTopics(project.topics)
  }))
}

const nestTopics = (topics) => {
  const topicMap = {}

  // First, map each topic by its ID
  topics.forEach(topic => {
    topic.subTopics = []
    topicMap[topic.id] = topic
  })

  // Then, organize topics into their parent topics
  const nestedTopics = []
  topics.forEach(topic => {
    if (topic.parent_topic_id === null) {
      nestedTopics.push(topic)
    } else {
      const parentTopic = topicMap[topic.parent_topic_id]
      if (parentTopic) {
        parentTopic.subTopics.push(topic)
      }
    }
  })

  return nestedTopics
}

export const initializeProjects = () => {
  return async dispatch => {
    const projects = await projectService.getAllWithReference()
    if (projects) {
      // Transform the topics structure for each project
      const transformedProjects = transformProjects(projects)
      console.log(transformedProjects)
      dispatch(setProjects(transformedProjects))
    }
  }
}

export const deleteProject = (project) => {
  return async (dispatch, getState) => {
    const projects = getState().projects
    if (window.confirm('Delete ' + project.name)) {
      await projectService.deleteProject(project)
      const newProjects = projects.filter(p => p.id !== project.id)
      dispatch(setProjects(newProjects))
    }
  }
}

export const archiveProject = (project) => {
  return async (dispatch, getState) => {
    const projects = getState().projects
    if (window.confirm('Archive ' + project.name)) {
      await projectService.archiveProject(project)
      const newProjects = projects.filter(p => p.id !== project.id)
      dispatch(setProjects(newProjects))
    }
  }
}

export const updateProject = (project) => {
  return async (dispatch, getState) => {
    const projects = getState().projects
    const updatedProject = await projectService
      .update(project.id, project.name)
    const newProjects = projects.map(p =>
      p.id === updatedProject.id ? updatedProject : p)
    dispatch(setProjects(newProjects))
  }
}

export const createProject = (project, session) => {
  return async (dispatch, getState) => {
    const projects = getState().projects
    const savedProject = await projectService
      .create({ ...project, userId: session?.user?.id })
    const newProjects = projects.concat(savedProject)
    dispatch(setProjects(newProjects))
  }
}

export default projectSlice.reducer
