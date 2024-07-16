import { useState, useEffect, useRef } from 'react'
import Projects from './components/Projects'
import Togglable from './components/Togglable'
import Visible from './components/Visible'
import ProjectForm from './components/ProjectForm'
import projectService from './services/projects'
import ProjectEditForm from './components/ProjectEditForm'

import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabaseUrl = 'https://melsspoompxwejtdxmzc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lbHNzcG9vbXB4d2VqdGR4bXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxNzAzODUsImV4cCI6MjAzNTc0NjM4NX0.kPDn_-Jmism7oKEGTDaq9QhErl_6h3xsWoR4Fnf-rDg'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [projects, setProjects] = useState([])
  const projectFormRef = useRef()
  const projectEditFormVisibleRef = useRef()
  const projectEditFormRef = useRef()

  const [session, setSession] = useState(null)

  // Fetch Data
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    const fetchData = async () => {
      const projects = await projectService.getAll()
      if (projects) {
        setProjects(projects)
      }
    }
    fetchData()

    return () => subscription.unsubscribe()
  }, [])

  const addProject = async (projectObject) => {
    projectFormRef.current.toggleVisibility()
    const data = await projectService
          .create({ ...projectObject, userId: session?.user?.id })
    const newProjects = projects.concat(data)
    setProjects(newProjects)
  }

  const projectForm = () => (
    <Togglable buttonLabel='new project' ref={projectFormRef}>
      <ProjectForm createProject={addProject} />
    </Togglable>
  )

  const updateProject = async (projectObject) => {
    projectEditFormVisibleRef.current.setVisible(false)
    const data = await projectService
      .update(projectObject.id, projectObject.name)
    const newProjects = projects.map(p => p.id === data.id ? data : p)
    setProjects(newProjects)
  }

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

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  } else {
    return (
      <>
        <h2>Progress</h2>
        <p>
          In case you need record the <strong>progress</strong> while getting things done.
        </p>
        <Projects projects={projects} onProjectDelete={handleProjectDelete} onProjectEdit={handleProjectEdit} />
        {projectForm()}
        {projectEditForm()}
        <button
          onClick={async () => {
            const { error } = await supabase.auth.signOut()
            if (error) console.log('Error logging out:', error.message)
          }}
        >
          Logout
        </button>
      </>
    )
  }
}

export default App
