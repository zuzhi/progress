import { useRef } from 'react'
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
    </li>
  )
}

export default Project
