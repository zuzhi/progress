import { useRef } from 'react'
import Togglable from './Togglable'
import TopicForm from './TopicForm'

const Topic = ({ topic, onTopicDelete, onTopicEdit, onTopicAdd }) => {
  const topicFormRef = useRef()

  const addTopic = (topicObject) => {
    topicFormRef.current.toggleVisibility()
    onTopicAdd({
      ...topicObject,
      project_id: topic.project_id,
      parent_topic_id: topic.id
    })
  }

  const topicForm = () => (
    <Togglable buttonLabel='new topic' ref={topicFormRef}>
      <TopicForm createTopic={addTopic} />
    </Togglable>
  )

  return (
    <li>
      {topic.name}
      <button onClick={() => onTopicEdit(topic)}>edit</button>
      <button onClick={() => onTopicDelete(topic)}>delete</button>
      {topicForm()}
      {topic.subTopics && topic.subTopics.length > 0 && (
        <ul>
          {topic.subTopics.map(subTopic => (
            <Topic key={subTopic.id} topic={subTopic} onTopicDelete={onTopicDelete} onTopicEdit={onTopicEdit} onTopicAdd={onTopicAdd} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default Topic
