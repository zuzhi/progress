import { useState, useRef } from 'react'
import Togglable from './Togglable'
import TopicForm from './TopicForm'

const Topic = ({
  topic,
  onTopicDelete,
  onTopicEdit,
  onTopicAdd,
  onTopicStatusChange
}) => {
  const topicFormRef = useRef()

  const [topicFormVisible, setTopicFormVisible] = useState(false)

  const handleTopicFormVisibleChange = (visible) => {
    setTopicFormVisible(visible)
  }

  const addTopic = (topicObject) => {
    topicFormRef.current.toggleVisibility()
    onTopicAdd({
      ...topicObject,
      project_id: topic.project_id,
      parent_topic_id: topic.id
    })
  }

  const topicForm = () => (
    <Togglable buttonLabel='new sub-topic' ref={topicFormRef} onVisibleChange={handleTopicFormVisibleChange}>
      <TopicForm onTopicCreate={addTopic} isVisible={topicFormVisible} />
    </Togglable>
  )

  return (
    <li>
      <span className={topic.status.replace(' ', '-')}>
      {topic.name}
      </span>
      <span className='buttons'>
        &nbsp;
        <button onClick={() => onTopicEdit(topic)}>edit</button>
        <button onClick={() => onTopicDelete(topic)}>delete</button>
        <button onClick={() => onTopicStatusChange(topic, 'pending')}>pending</button>
        <button onClick={() => onTopicStatusChange(topic, 'in progress')}>in progress</button>
        <button onClick={() => onTopicStatusChange(topic, 'done')}>done</button>
        <button onClick={() => onTopicStatusChange(topic, 'skip')}>skip</button>
        <button onClick={() => onTopicStatusChange(topic, 'skim')}>skim</button>
      </span>
      {topicForm()}
      {topic.subTopics && topic.subTopics.length > 0 && (
        <ul>
          {topic.subTopics.map(subTopic => (
            <Topic
              key={subTopic.id}
              topic={subTopic}
              onTopicDelete={onTopicDelete}
              onTopicEdit={onTopicEdit}
              onTopicAdd={onTopicAdd}
              onTopicStatusChange={onTopicStatusChange}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default Topic
