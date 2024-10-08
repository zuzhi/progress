import { useRef, useState } from "react"
import EditorForm from "./EditorForm"
import Projects from "./Projects"
import Togglable from "./Togglable"
import { useDispatch, useSelector } from "react-redux"
import ProjectForm from "./ProjectForm"
import TopicEditForm from "./TopicEditForm"
import ProjectEditForm from "./ProjectEditForm"
import { updateTopic } from "../reducers/topicReducer"
import {
  createProject,
  setSelectedProject,
  updateProject
} from "../reducers/projectReducer"
import PageTitle from "./PageTitle"
import TreePlot from "./TreePlot"

const ProjectsPage = () => {
  const [projectFormVisible, setProjectFormVisible] = useState(false)
  const [projectEditFormVisible, setProjectEditFormVisible] = useState(false)
  const [topicEditFormVisible, setTopicEditFormVisible] = useState(false)
  const [combinedContent, setCombinedContent] = useState('')

  const projectFormRef = useRef()
  const projectEditFormVisibleRef = useRef()
  const projectEditFormRef = useRef()
  const topicEditFormVisibleRef = useRef()
  const topicEditFormRef = useRef()
  const editorFormVisibleRef = useRef()
  const treePlotVisibleRef = useRef()

  const dispatch = useDispatch()
  const session = useSelector(state => state.session)
  const projects = useSelector(state => state.projects.list)

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

  const handleProjectCreate = async (project) => {
    projectFormRef.current.toggleVisibility()
    dispatch(createProject(project, session?.user?.id))
  }

  const projectEditForm = () => (
    <Togglable ref={projectEditFormVisibleRef} onVisibleChange={handleProjectEditFormVisibleChange}>
      <ProjectEditForm
        onProjectUpdate={handleProjectUpdate}
        ref={projectEditFormRef}
        isVisible={projectEditFormVisible}
      />
    </Togglable>
  )

  const handleProjectUpdate = async (project) => {
    projectEditFormVisibleRef.current.setVisible(false)
    dispatch(updateProject(project))
  }

  const handleProjectEdit = async (projectObject) => {
    projectEditFormVisibleRef.current.setVisible(true)
    projectEditFormRef.current.setId(projectObject.id)
    projectEditFormRef.current.setNewProject(projectObject.name)
  }

  const topicEditForm = () => (
    <Togglable ref={topicEditFormVisibleRef} onVisibleChange={handleTopicEditFormVisibleChange}>
      <TopicEditForm
        onTopicUpdate={handleTopicUpdate}
        ref={topicEditFormRef}
        isVisible={topicEditFormVisible}
      />
    </Togglable>
  )

  const handleTopicUpdate = async (topic) => {
    topicEditFormVisibleRef.current.setVisible(false)
    dispatch(updateTopic(topic))
  }

  const handleTopicEdit = async (topicObject) => {
    topicEditFormVisibleRef.current.setVisible(true)
    topicEditFormRef.current.setId(topicObject.id)
    topicEditFormRef.current.setNewTopic(topicObject.name)
  }

  const generateTopicList = (topics) => {
    const ul = document.createElement('ul')

    topics.forEach(topic => {
      const li = document.createElement('li')
      li.innerHTML = `${topic.name}`
      if (topic.topics && topic.topics.length > 0) {
        const subUl = generateTopicList(topic.topics)
        li.appendChild(subUl)
      }
      ul.appendChild(li)
    })

    return ul
  }

  const handleOpenInEditor = (project) => {
    editorFormVisibleRef.current.setVisible(true)

    const topicsUl = generateTopicList(project.topics ?? [])
    setCombinedContent(topicsUl.outerHTML)
    dispatch(setSelectedProject(project))
  }

  const handleViewAsTree = (project) => {
    treePlotVisibleRef.current.setVisible(true)
    dispatch(setSelectedProject(project))
  }

  return (
    <>
      <PageTitle title="projects" />
      {projectForm()}
      {projectEditForm()}
      {topicEditForm()}
      <Projects
        projects={projects}
        onProjectEdit={handleProjectEdit}
        onTopicEdit={handleTopicEdit}
        openInEditor={handleOpenInEditor}
        viewAsTree={handleViewAsTree}
      />
      <Togglable ref={editorFormVisibleRef}>
        <EditorForm combinedContent={combinedContent} />
      </Togglable>
      <Togglable ref={treePlotVisibleRef}>
        <TreePlot />
      </Togglable>
    </>
  )
}

export default ProjectsPage
