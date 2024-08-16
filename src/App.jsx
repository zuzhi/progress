import { useState, useEffect, useRef } from 'react'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Projects from './components/Projects'
import Togglable from './components/Togglable'
import ProjectForm from './components/ProjectForm'
import ProjectEditForm from './components/ProjectEditForm'
import TopicEditForm from './components/TopicEditForm'

import { supabase } from './lib/initSupabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { createProject, initializeProjects, setProjects, transformProjects, updateProject } from './reducers/projectReducer'
import { initProject, updateTopic } from './reducers/topicReducer'
import { setSession } from './reducers/sessionReducer'
import Editor from './components/Editor'

function App() {
  const [loading, setLoading] = useState(true)
  const [projectFormVisible, setProjectFormVisible] = useState(false)
  const [projectEditFormVisible, setProjectEditFormVisible] = useState(false)
  const [topicEditFormVisible, setTopicEditFormVisible] = useState(false)
  const [editorContent, setEditorContent] = useState('')
  const [combinedContent, setCombinedContent] = useState('')
  const [project, setProject] = useState(null)

  const projectFormRef = useRef()
  const projectEditFormVisibleRef = useRef()
  const projectEditFormRef = useRef()
  const topicEditFormVisibleRef = useRef()
  const topicEditFormRef = useRef()

  const dispatch = useDispatch()
  const projects = useSelector(state => state.projects)
  const session = useSelector(state => state.session)

  // Use a ref to access the quill instance from the child component
  const quillRef = useRef(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      dispatch(setSession(session))
      setLoading(false)

      if (session) {
        dispatch(initializeProjects())
      }
    }
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
      if (session) {
        dispatch(initializeProjects())
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

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
    dispatch(createProject(project, session))
  }

  const projectEditForm = () => (
    <Togglable ref={projectEditFormVisibleRef} onVisibleChange={handleProjectEditFormVisibleChange}>
      <ProjectEditForm onProjectUpdate={handleProjectUpdate} ref={projectEditFormRef} isVisible={projectEditFormVisible} />
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
      <TopicEditForm onTopicUpdate={handleTopicUpdate} ref={topicEditFormRef} isVisible={topicEditFormVisible} />
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

  const generateTopicList = (topics) => {
    // Create the outer <ul> element
    const ul = document.createElement('ul')

    // Iterate over each topic
    topics.forEach(topic => {
      // Create a <li> element for each topic
      const li = document.createElement('li')
      li.setAttribute('data-id', topic.id)
      li.setAttribute('data-project_id', topic.project_id)
      if (topic.parent_topic_id) {
        li.setAttribute('data-parent_topic_id', topic.parent_topic_id)
      }
      li.setAttribute('data-status', topic.status)
      li.innerHTML = `${topic.name}`

      // If the topic has subtopics, call the function recursively
      if (topic.topics && topic.topics.length > 0) {
        const subUl = generateTopicList(topic.topics)
        li.appendChild(subUl)
      }

      // Append the <li> to the <ul>
      ul.appendChild(li)
    })

    console.log(ul)
    return ul
  }

  const handleOpenInEditor = (project) => {
    console.log(project)

    const topicsUl = generateTopicList(project.topics)

    setProject(project)
    setCombinedContent(topicsUl.outerHTML)
  }

  const extractAttribute = (element, attributeName) => {
    return element.getAttribute(attributeName)
  }

  const parseTopic = (element) => {
    // parse topic text, extract id, status and name, in form: [id]/[] [status]/[] name
    return {
      parentTopicId: extractAttribute(element, 'data-parent_topic_id'),
      id: extractAttribute(element, 'data-id'),
      status: extractAttribute(element, 'data-status'),
      class: extractAttribute(element, 'class'),
      name: element.innerText.trim()
    }
  }

  const parseTopics = (editorHTML) => {
    // deal with id, parent_topic_id, status
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = editorHTML

    const parsedTopics = Array.from(tempDiv.querySelectorAll('li')).map(li =>
      parseTopic(li)
    )

    console.log("Parsed Topics:", parsedTopics)
    return parsedTopics
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (project && window.confirm(`(re)initialize ${project.name}?`)) {
      const quill = quillRef.current?.getQuillInstance()
      if (quill) {
        const parsedTopics = parseTopics(quill.root.innerHTML)
        dispatch(initProject(project, parsedTopics, session))
      } else {
        console.error("Quill instance is not available.")
      }
    }
  }

  return (
    <>
      <h2 className='product-name'><b>progress</b></h2>
      {projectForm()}
      {projectEditForm()}
      {topicEditForm()}
      <div className='row'>
        <div className='column'>
          <Projects
            onProjectEdit={handleProjectEdit}
            onTopicEdit={handleTopicEdit}
            openInEditor={handleOpenInEditor}
          />
          <span className="footer">
            {session.user.email.split('@')[0]} |
          </span>
          <button
            className='button'
            onClick={async () => {
              const { error } = await supabase.auth.signOut()
              if (error) {
                console.log('Error logging out:', error.message)
              } else {
                //dispatch(initializeProjects())
              }
            }}
          >
            logout
          </button>
        </div>
        <div className='column container'>
          <form onSubmit={handleSubmit}>
            <p><b>project editor</b></p>
            <p>project name: {project?.name}</p>
            <div className='form-group'>
              <label>topics: </label>
              <Editor ref={quillRef} content={combinedContent} setContent={setEditorContent} />
            </div>
            <button type="submit">save</button>
          </form>
        </div>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
