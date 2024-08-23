import { createSlice } from "@reduxjs/toolkit"
import projectService from '../services/projects'

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    archives: [],
    selected: null
  },
  reducers: {
    setProjects(state, action) {
      state.list = action.payload
    },
    setArchives(state, action) {
      state.archives = action.payload
    },
    setSelectedProject(state, action) {
      state.selected = action.payload
    },
    clearSelectedProject(state) {
      state.selected = null
    }
  }
})

export const {
  setProjects,
  setArchives,
  setSelectedProject,
  clearSelectedProject
} = projectSlice.actions

export const transformProjects = (projects) => {
  // Transform the topics structure for each project
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

export const fetchProjects = () => {
  return async dispatch => {
    const projects = await projectService.getAllWithReference()
    if (projects) {
      const transformedProjects = transformProjects(projects)
      dispatch(setProjects(transformedProjects))
    }
  }
}

export const fetchArchives = () => {
  return async dispatch => {
    const archives = await projectService.getArchivesWithReference()
    if (archives) {
      const transformedProjects = transformProjects(archives)
      dispatch(setArchives(transformedProjects))
    }
  }
}

export const initializeProjects = () => {
  return async dispatch => {
    const projects = await projectService.getAllWithReference()
    const archives = await projectService.getArchivesWithReference()
    if (projects) {
      const transformedProjects = transformProjects(projects)
      dispatch(setProjects(transformedProjects))
    }

    if (archives) {
      const transformedProjects = transformProjects(archives)
      dispatch(setArchives(transformedProjects))
    }
  }
}

export const deleteProject = (project) => {
  return async (dispatch, getState) => {
    if (window.confirm(`delete ${project.name}?`)) {
      await projectService.deleteProject(project)
      if (project.status === 'normal') {
        const projects = getState().projects.list
        const newProjects = projects.filter(p => p.id !== project.id)
        dispatch(setProjects(newProjects))
      } else {
        const archives = getState().projects.archives
        const newArchives = archives.filter(p => p.id !== project.id)
        dispatch(setArchives(newArchives))
      }
    }
  }
}

export const archiveProject = (project) => {
  return async (dispatch, getState) => {
    const projects = getState().projects.list
    const archives = getState().projects.archives
    if (window.confirm(`archive ${project.name}?`)) {
      await projectService.archiveProject(project)
      const newProjects = projects.filter(p => p.id !== project.id)
      dispatch(setProjects(newProjects))
      const newArchives = archives.concat(project)
      newArchives.sort((a, b) => a.id - b.id)
      dispatch(setArchives(newArchives))
    }
  }
}

export const unarchiveProject = (project) => {
  return async (dispatch, getState) => {
    const projects = getState().projects.list
    const archives = getState().projects.archives
    if (window.confirm(`unarchive ${project.name}?`)) {
      await projectService.unarchiveProject(project)
      const newProjects = projects.concat(project)
      newProjects.sort((a, b) => a.id - b.id)
      dispatch(setProjects(newProjects))
      const newArchives = archives.filter(p => p.id !== project.id)
      dispatch(setArchives(newArchives))
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
        userId
      })
    const newProjects = projects.concat(savedProject)
    dispatch(setProjects(newProjects))
  }
}

export default projectSlice.reducer
