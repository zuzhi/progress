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
  onTopicAdd
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
    localStorage.setItem(storageKey, JSON.stringify(isCollapsed));
  }, [isCollapsed, storageKey]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const topicFormRef = useRef()

  const handleTopicCreate = (topicObject) => {
    topicFormRef.current.toggleVisibility()
    const topicToSave = {
      ...topicObject,
      project_id: project.id
    }
    dispatch(createTopic(topicToSave, session))
  }

  const topicForm = () => (
    <Togglable buttonLabel='new sub-topic' ref={topicFormRef} onVisibleChange={handleTopicFormVisibleChange}>
      <TopicForm onTopicCreate={handleTopicCreate} isVisible={topicFormVisible} />
    </Togglable>
  )

  return (
    <li>
      <span className='project'>
        {project.name} - {project.progress}%
      </span>
      <span className='buttons'>
        &nbsp;
        <button onClick={() => handleProjectEdit(project)}>edit</button>
        <button onClick={() => dispatch(deleteProject(project))}>delete</button>
        <button onClick={() => dispatch(archiveProject(project))}>archive</button>
      </span>
      <span className='buttons' onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
        &nbsp;
        {isCollapsed ? '[' + (project.topics?.length ?? 0) + ' more]' : '[-]'}
      </span>
      {!isCollapsed && (
        <div className='collapseContent'>
          {topicForm()}
          {
            project.topics && (
              <ul>
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
