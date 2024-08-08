import { useState, useEffect, useRef } from 'react'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Projects from './components/Projects'
import Togglable from './components/Togglable'
import Visible from './components/Visible'
import ProjectForm from './components/ProjectForm'
import ProjectEditForm from './components/ProjectEditForm'
import projectService from './services/projects'
import TopicEditForm from './components/TopicEditForm'
import topicService from './services/topics'

import { supabase } from './lib/initSupabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [projectFormVisible, setProjectFormVisible] = useState(false)
  const [projectEditFormVisible, setProjectEditFormVisible] = useState(false)
  const [topicEditFormVisible, setTopicEditFormVisible] = useState(false)

  const projectFormRef = useRef()
  const projectEditFormVisibleRef = useRef()
  const projectEditFormRef = useRef()
  const topicEditFormVisibleRef = useRef()
  const topicEditFormRef = useRef()


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

  const transformProjects = (projects) => {
    return projects.map(project => ({
      ...project,
      topics: nestTopics(project.topics)
    }))
  }

  // Fetch Data
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }
    checkSession()

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
          setProjects(transformedProjects)
        }
      }
      fetchData()
    }
  }, [session])

  const handleProjectFormVisibleChange = (visible) => {
    setProjectFormVisible(visible)
  }

  const handleProjectEditFormVisibleChange = (visible) => {
    setProjectEditFormVisible(visible)
  }

  const handleTopicEditFormVisibleChange = (visible) => {
    setTopicEditFormVisible(visible)
  }

  const projectForm = () => (
    <Togglable buttonLabel='new project' ref={projectFormRef} onVisibleChange={handleProjectFormVisibleChange}>
      <ProjectForm onProjectCreate={handleProjectCreate} isVisible={projectFormVisible} />
    </Togglable>
  )

  const handleProjectCreate = async (projectObject) => {
    projectFormRef.current.toggleVisibility()
    const data = await projectService
          .create({ ...projectObject, userId: session?.user?.id })
    const newProjects = projects.concat(data)
    setProjects(newProjects)
  }

  const projectEditForm = () => (
    <Visible ref={projectEditFormVisibleRef} onVisibleChange={handleProjectEditFormVisibleChange}>
      <ProjectEditForm onProjectUpdate={handleProjectUpdate} ref={projectEditFormRef} isVisible={projectEditFormVisible} />
    </Visible>
  )

  const handleProjectUpdate = async (projectObject) => {
    projectEditFormVisibleRef.current.setVisible(false)
    const data = await projectService
      .update(projectObject.id, projectObject.name)
    const newProjects = projects.map(p => p.id === data.id ? data : p)
    setProjects(newProjects)
  }

  const handleProjectDelete = async (project) => {
    if (window.confirm('Delete ' + project.name)) {
      await projectService.deleteProject(project)
      const newProjects = projects.filter(p => p.id !== project.id)
      setProjects(newProjects)
    }
  }

  const handleProjectEdit = async (projectObject) => {
    projectEditFormVisibleRef.current.setVisible(true)
    projectEditFormRef.current.setId(projectObject.id)
    projectEditFormRef.current.setNewProject(projectObject.name)
  }

  const handleProjectArchive = async (project) => {
    if (window.confirm('Archive ' + project.name)) {
      await projectService.archiveProject(project)
      const newProjects = projects.filter(p => p.id !== project.id)
      setProjects(newProjects)
    }
  }

  const topicEditForm = () => (
    <Visible ref={topicEditFormVisibleRef} onVisibleChange={handleTopicEditFormVisibleChange}>
      <TopicEditForm onTopicUpdate={handleTopicUpdate} ref={topicEditFormRef} isVisible={topicEditFormVisible} />
    </Visible>
  )

  const handleTopicUpdate = async (topicObject) => {
    topicEditFormVisibleRef.current.setVisible(false)
    const topic = await topicService
      .update(topicObject.id, topicObject.name)
    const newProjects = projects.map(project => ({
      ...project,
      topics: updateTopicInNestedTopics(project.topics, topic)
    }))
    setProjects(newProjects)
  }

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
      const updatedProjects = await updateProgress(newProjects, topic.project_id)
      setProjects(updatedProjects)
    }
  }

  const handleTopicStatusChange = async (topic, topicStatus) => {
    // Update topic
    const topicToUpdate = {
      ...topic,
      status: topicStatus
    }
    const topicUpdated = await topicService
      .updateStatus(topicToUpdate.id, topicToUpdate.status)
    // Update project(s) with topic
    const newProjects = projects.map(project => ({
      ...project,
      topics: updateTopicInNestedTopics(project.topics, topicUpdated)
    }))
    // Update project progress
    const updatedProjects = await updateProgress(newProjects, topicUpdated.project_id)
    setProjects(updatedProjects)
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

  const handleTopicEdit = async (topicObject) => {
    topicEditFormVisibleRef.current.setVisible(true)
    topicEditFormRef.current.setId(topicObject.id)
    topicEditFormRef.current.setNewTopic(topicObject.name)
  }

  const handleTopicCreate = async (topicObject) => {
    const topic = await topicService
      .create({ ...topicObject, userId: session?.user?.id })
    const projects = await projectService.getAllWithReference()
    const transformedProjects = transformProjects(projects)
    const updatedProjects = await updateProgress(transformedProjects, topic.project_id)
    setProjects(updatedProjects)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!session) {
    return (
      <div className='auth-form'>
        <h2 className='product-name'><b>progress</b></h2>
        <p>
          In case you need to record the <strong>progress</strong> while getting things done.
        </p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
        <div className='howtouse'>
          <h3>
            how to use <span className='product-name'>progress</span>?
          </h3>
          <ul>
            <li>register</li>
            <li>add a project</li>
            <li>add some topics</li>
            <li>update topic status</li>
          </ul>
          <p>then the project progress will automatically be calculated, yeah, that&apos;s the whole point.</p>
          <p>
            for example:
          </p>
          <ul>
            <li>
              <b>fullstackopen - 50%</b>
              <ul>
                <li><s>Part 0: Fundamentals of Web apps</s></li>
                <li><s>Part 1: Introduction to React</s></li>
                <li>Part 2: Communicating with server</li>
                <li>Part 3: Programming a server with NodeJS and Express</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <>
      <h2 className='product-name'><b>progress</b></h2>
      {projectForm()}
      {projectEditForm()}
      {topicEditForm()}
      <Projects
        projects={projects}
        onProjectDelete={handleProjectDelete}
        onProjectEdit={handleProjectEdit}
        onProjectArchive={handleProjectArchive}
        onTopicDelete={handleTopicDelete}
        onTopicEdit={handleTopicEdit}
        onTopicAdd={handleTopicCreate}
        onTopicStatusChange={handleTopicStatusChange}
      />
      <span className="footer">
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
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
