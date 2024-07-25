import { useState, useEffect, useRef } from 'react'
import Topic from './Topic'
import Togglable from './Togglable'
import TopicForm from './TopicForm'

const Project = ({
  project,
  onProjectDelete,
  onProjectEdit,
  onTopicDelete,
  onTopicEdit,
  onTopicAdd,
  onTopicStatusChange
}) => {
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

  const addTopic = (topicObject) => {
    topicFormRef.current.toggleVisibility()
    onTopicAdd({
      ...topicObject,
      project_id: project.id
    })
  }

  const topicForm = () => (
    <Togglable buttonLabel='new sub-topic' ref={topicFormRef}>
      <TopicForm createTopic={addTopic} />
    </Togglable>
  )

  return (
    <li>
      <span className='project'>
        {project.name} - {project.progress}%
      </span>
      <span className='buttons'>
        &nbsp;
        <button onClick={() => onProjectEdit(project)}>edit</button>
        <button onClick={() => onProjectDelete(project)}>delete</button>
      </span>
      <span className='buttons' onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
        &nbsp;
        {isCollapsed ? '[' + project.topics?.length + ' more]' : '[-]'}
      </span>
      {!isCollapsed && (
        <div>
          {topicForm()}
          {
            project.topics && (
              <ul>
                {project.topics.map(topic => (
                  <Topic
                    key={topic.id}
                    topic={topic}
                    onTopicDelete={onTopicDelete}
                    onTopicEdit={onTopicEdit}
                    onTopicAdd={onTopicAdd}
                    onTopicStatusChange={onTopicStatusChange}
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
