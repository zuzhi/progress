import { useState, useEffect, useRef } from 'react'
import Topic from './Topic'
import Togglable from './Togglable'
import TopicForm from './TopicForm'
import { useDispatch, useSelector } from 'react-redux'
import { archiveProject, deleteProject } from '../reducers/projectReducer'
import { createTopic } from '../reducers/topicReducer'

const Project = ({
  project,
  handleProjectEdit,
  onTopicEdit,
  onTopicAdd,
  openInEditor,
  viewAsTree
}) => {
  const dispatch = useDispatch()
  const session = useSelector(state => state.session)
  const [topicFormVisible, setTopicFormVisible] = useState(false)

  const handleTopicFormVisibleChange = (visible) => {
    setTopicFormVisible(visible)
  }

  // Unique key for each project's collapsed state in localStorage
  const storageKey = `project_${project.id}_collapsed`

  // Load the initial state from localStorage, defaulting to true (collapsed)
  const initialCollapsedState = JSON.parse(localStorage.getItem(storageKey)) ?? false
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsedState)

  // Update localStorage whenever isCollapsed state changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(isCollapsed))
  }, [isCollapsed, storageKey])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const topicFormRef = useRef()

  const handleTopicCreate = (topicObject) => {
    topicFormRef.current.toggleVisibility()
    const topicToSave = {
      ...topicObject,
      project_id: project.id
    }
    dispatch(createTopic(topicToSave, session?.user?.id))
  }

  const topicForm = () => (
    <Togglable buttonLabel='new sub-topic' ref={topicFormRef} onVisibleChange={handleTopicFormVisibleChange}>
      <TopicForm onTopicCreate={handleTopicCreate} isVisible={topicFormVisible} />
    </Togglable>
  )

  return (
    <li>
      <span className='font-bold'>
        {project.name} - {project.progress}%
      </span>
      <span className='buttons'>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => handleProjectEdit(project)}>edit</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(deleteProject(project))}>delete</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(archiveProject(project))}>archive</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => openInEditor(project)}>open in editor</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => viewAsTree(project)}>view as tree</button>
      </span>
      <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={toggleCollapse}>
        {isCollapsed ? '[' + (project.topics ? project.topics.length : 0) + ' more]' : '[-]'}
      </button>
      {!isCollapsed && (
        <div className='collapseContent'>
          {topicForm()}
          {
            project.topics && (
              <ul className='pl-4 list-disc list-outside [&_ul]:list-[revert]'>
                {project.topics.map(topic => (
                  <Topic
                    key={topic.id}
                    topic={topic}
                    onTopicEdit={onTopicEdit}
                  />
                ))}
              </ul>
            )
          }
        </div>
      )}
    </li>
  )
}

export default Project
