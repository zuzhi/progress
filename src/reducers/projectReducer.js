import { createSlice } from "@reduxjs/toolkit"
import projectService from '../services/projects'

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    selected: null
  },
  reducers: {
    setProjects(state, action) {
      state.list = action.payload
    },
    setSelectedProject(state, action) {
      state.selected = action.payload
    },
    clearSelectedProject(state) {
      state.selected = null
    }
  }
})

export const { setProjects, setSelectedProject, clearSelectedProject } = projectSlice.actions

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
    topic.topics = []
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
        parentTopic.topics.push(topic)
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
      dispatch(setProjects(transformedProjects))
    }
  }
}

export const deleteProject = (project) => {
  return async (dispatch, getState) => {
    const projects = getState().projects.list
    if (window.confirm(`delete ${project.name}?`)) {
      await projectService.deleteProject(project)
      const newProjects = projects.filter(p => p.id !== project.id)
      dispatch(setProjects(newProjects))
    }
  }
}

export const archiveProject = (project) => {
  return async (dispatch, getState) => {
    const projects = getState().projects.list
    if (window.confirm(`archive ${project.name}?`)) {
      await projectService.archiveProject(project)
      const newProjects = projects.filter(p => p.id !== project.id)
      dispatch(setProjects(newProjects))
    }
  }
}

export const updateProject = (project) => {
  return async (dispatch, getState) => {
    const projects = getState().projects.list
    const updatedProject = await projectService
      .update(project.id, project.name)
    const newProjects = projects.map(p =>
      p.id === updatedProject.id ? updatedProject : p)
    dispatch(setProjects(newProjects))
  }
}

export const createProject = (project, userId) => {
  return async (dispatch, getState) => {
    const projects = getState().projects.list
    const savedProject = await projectService
      .create({
        ...project,
        status: 'normal',
        user_id: userId
      })
    const newProjects = projects.concat(savedProject)
    dispatch(setProjects(newProjects))
  }
}

export default projectSlice.reducer
