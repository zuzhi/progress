import { useState, useEffect, useRef } from 'react'
import Projects from './components/Projects'
import Togglable from './components/Togglable'
import Visible from './components/Visible'
import ProjectForm from './components/ProjectForm'
import projectService from './services/projects'
import ProjectEditForm from './components/ProjectEditForm'

function App() {
  const [projects, setProjects] = useState([])
  const projectFormRef = useRef()
  const projectEditFormVisibleRef = useRef()
  const projectEditFormRef = useRef()

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const projects = await projectService.getAll()
      if (projects) {
        setProjects(projects)
      }
    }
    fetchData()
  }, [])

  const addProject = async (projectObject) => {
    projectFormRef.current.toggleVisibility()
    const data = await projectService
      .create(projectObject)
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

  return (
    <>
      <h2>Progress</h2>
      <p>
        In case you need record the <strong>progress</strong> while <a href='https://todoist.com/zh-CN/productivity-methods/getting-things-done' target='_blank'>getting things done</a>.
      </p>
      <p>
        A book, a course? It's your choice.
      </p>
      <Projects projects={projects} onProjectDelete={handleProjectDelete} onProjectEdit={handleProjectEdit} />
      {projectForm()}
      {projectEditForm()}
    </>
  )
}

export default App
