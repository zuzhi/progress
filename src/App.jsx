import { useState, useEffect, useRef } from 'react'
import Projects from './components/Projects'
import Togglable from './components/Togglable'
import Visible from './components/Visible'
import ProjectForm from './components/ProjectForm'
import ProjectEditForm from './components/ProjectEditForm'
import projectService from './services/projects'
import TopicEditForm from './components/TopicEditForm'
import topicService from './services/topics'

import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import './App.css'

const supabaseUrl = 'https://melsspoompxwejtdxmzc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbHNzcG9vbXB4d2VqdGR4bXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxNzAzODUsImV4cCI6MjAzNTc0NjM4NX0.kPDn_-Jmism7oKEGTDaq9QhErl_6h3xsWoR4Fnf-rDg'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [projects, setProjects] = useState([])
  const projectFormRef = useRef()
  const projectEditFormVisibleRef = useRef()
  const projectEditFormRef = useRef()
  const topicEditFormVisibleRef = useRef()
  const topicEditFormRef = useRef()

  const [session, setSession] = useState(null)

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

  // Fetch Data
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session)
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const projects = await projectService.getAllWithReference()
        if (projects) {
          // Transform the topics structure for each project
          const transformedProjects = projects.map(project => ({
            ...project,
            topics: nestTopics(project.topics)
          }))
          console.log(transformedProjects)
          setProjects(transformedProjects)
        }
      }
      fetchData()
    }
  }, [session])

  const addProject = async (projectObject) => {
    projectFormRef.current.toggleVisibility()
    const data = await projectService
          .create({ ...projectObject, userId: session?.user?.id })
    const newProjects = projects.concat(data)
    setProjects(newProjects)
  }

  const updateProject = async (projectObject) => {
    projectEditFormVisibleRef.current.setVisible(false)
    const data = await projectService
      .update(projectObject.id, projectObject.name)
    const newProjects = projects.map(p => p.id === data.id ? data : p)
    setProjects(newProjects)
  }

  const projectForm = () => (
    <Togglable buttonLabel='new project' ref={projectFormRef}>
      <ProjectForm createProject={addProject} />
    </Togglable>
  )

  const projectEditForm = () => (
    <Visible ref={projectEditFormVisibleRef}>
      <ProjectEditForm updateProject={updateProject} ref={projectEditFormRef} />
    </Visible>
  )

  const handleProjectDelete = (project) => {
    if (window.confirm('Delete ' + project.name)) {
      projectService.deleteProject(project)
      const newProjects = projects.filter(p => p.id !== project.id)
      setProjects(newProjects)
    }
  }

  const handleProjectEdit = async (projectObject) => {
    console.log(projectObject)
    projectEditFormVisibleRef.current.setVisible(true)
    projectEditFormRef.current.setId(projectObject.id)
    projectEditFormRef.current.setNewProject(projectObject.name)
  }

  const updateTopic = async (topicObject) => {
    topicEditFormVisibleRef.current.setVisible(false)
    const topic = await topicService
      .update(topicObject.id, topicObject.name)
    console.log(topic)
    const newProjects = projects.map(project => ({
      ...project,
      topics: updateTopicInNestedTopics(project.topics, topic)
    }))
    setProjects(newProjects)
  }

  const topicEditForm = () => (
    <Visible ref={topicEditFormVisibleRef}>
      <TopicEditForm updateTopic={updateTopic} ref={topicEditFormRef} />
    </Visible>
  )

  const removeTopicInNestedTopics = (topics, topicToDelete) => {
    return topics
      .filter(topic => topic.id !== topicToDelete.id)
      .map(topic => ({
        ...topic,
        subTopics: removeTopicInNestedTopics(topic.subTopics, topicToDelete)
      }))
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

  const handleTopicDelete = async (topic) => {
    if (window.confirm('Delete ' + topic.name)) {
      await topicService.deleteTopic(topic)
      const newProjects = projects.map(project => ({
        ...project,
        topics: removeTopicInNestedTopics(project.topics, topic)
      }))
      setProjects(newProjects)
    }
  }

  const handleTopicStatusChange = async (topic, topicStatus) => {
    const topicToUpdate = {
      ...topic,
      status: topicStatus
    }
    const topicUpdated = await topicService
      .updateStatus(topicToUpdate.id, topicToUpdate.status)
    console.log(topicUpdated)
    const projectUpdated = await updateProgress(topicUpdated.project_id)
    console.log(projectUpdated)
    const newProjects = projects.map(project => ({
      ...project,
      progress: project.id === projectUpdated.id ? projectUpdated.progress : project.progress,
      topics: updateTopicInNestedTopics(project.topics, topicUpdated)
    }))
    setProjects(newProjects)
  }

  const updateProgress = async (projectId) => {
    const topics = await topicService.getAllByProject(projectId)
    const project = await projectService.getOne(projectId)
    const finished = topics.filter(topic => topic.status === 'done' || topic.status === 'skip')
    console.log(finished.length)
    console.log(topics.length)
    const newProject = {
      ...project,
      progress: Math.floor(finished.length / topics.length * 100)
    }
    await projectService.updateProgress(newProject.id, newProject.progress)
    return newProject
  }

  const handleTopicEdit = async (topicObject) => {
    console.log(topicObject)
    topicEditFormVisibleRef.current.setVisible(true)
    topicEditFormRef.current.setId(topicObject.id)
    topicEditFormRef.current.setNewTopic(topicObject.name)
  }

  const createTopic = (projects, topicToCreate) => {
    return projects.map(project => {
      if (project.id === topicToCreate.project_id) {
        // If parent_topic_id is null, it's a root topic
        if (topicToCreate.parent_topic_id === null) {
          return {
            ...project,
            topics: [...project.topics, { ...topicToCreate, subTopics: [] }]
          }
        } else {
          // If parent_topic_id is not null, it's a nested topic
          const addNestedTopic = (topics, topicToCreate) => {
            return topics.map(topic => {
              if (topic.id === topicToCreate.parent_topic_id) {
                return {
                  ...topic,
                  subTopics: [...topic.subTopics, { ...topicToCreate, subTopics: [] }]
                }
              } else {
                return {
                  ...topic,
                  subTopics: addNestedTopic(topic.subTopics, topicToCreate)
                }
              }
            })
          }

          return {
            ...project,
            topics: addNestedTopic(project.topics, topicToCreate)
          }
        }
      }
      return project
    })
  }

  const handleTopicAdd = async (topicObject) => {
    console.log(topicObject)
    const topic = await topicService
      .create({ ...topicObject, userId: session?.user?.id })
    console.log(topic)
    const newProjects = createTopic(projects, topic)
    setProjects(newProjects)
  }

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
      />
    )
  }

  return (
    <>
      <h2>Progress</h2>
      <p>
        In case you need to record the <strong>progress</strong> while getting things done.
      </p>
      {projectForm()}
      {projectEditForm()}
      {topicEditForm()}
      <Projects projects={projects} onProjectDelete={handleProjectDelete} onProjectEdit={handleProjectEdit} onTopicDelete={handleTopicDelete} onTopicEdit={handleTopicEdit} onTopicAdd={handleTopicAdd} onTopicStatusChange={handleTopicStatusChange} />
      <span className="buttons">
        {session.user.email.split('@')[0]} |&nbsp;
      </span>
      <button
        onClick={async () => {
          const { error } = await supabase.auth.signOut()
          if (error) {
            console.log('Error logging out:', error.message)
          } else {
            setProjects([])
          }
        }}
      >
        logout
      </button>
    </>
  )
}

export default App
