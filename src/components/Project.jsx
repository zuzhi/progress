import { useState, useEffect, useRef } from 'react'
import Topic from './Topic'
import Togglable from './Togglable'
import TopicForm from './TopicForm'

const Project = ({
  project,
  onProjectDelete,
  onProjectEdit,
  onProjectArchive,
  onTopicDelete,
  onTopicEdit,
  onTopicAdd,
  onTopicStatusChange
}) => {
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

  const addTopic = (topicObject) => {
    topicFormRef.current.toggleVisibility()
    onTopicAdd({
      ...topicObject,
      project_id: project.id
    })
  }

  const topicForm = () => (
    <Togglable buttonLabel='new sub-topic' ref={topicFormRef} onVisibleChange={handleTopicFormVisibleChange}>
      <TopicForm createTopic={addTopic} isVisible={topicFormVisible} />
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
        <button onClick={() => onProjectArchive(project)}>archive</button>
      </span>
      <span className='buttons' onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
        &nbsp;
        {isCollapsed ? '[' + (project.topics?.length ?? 0) + ' more]' : '[-]'}
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
