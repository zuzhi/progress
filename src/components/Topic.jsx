import { useState, useRef } from 'react'
import Togglable from './Togglable'
import TopicForm from './TopicForm'
import { createTopic, deleteTopic, updateTopicStatus } from '../reducers/topicReducer'
import { useDispatch, useSelector } from 'react-redux'

const Topic = ({
  topic,
  onTopicEdit
}) => {
  const dispatch = useDispatch()
  const session = useSelector(state => state.session)

  const topicFormRef = useRef()

  const [topicFormVisible, setTopicFormVisible] = useState(false)

  const handleTopicFormVisibleChange = (visible) => {
    setTopicFormVisible(visible)
  }

  const handleTopicCreate = (topicObject) => {
    topicFormRef.current.toggleVisibility()
    const topicToSave = {
      ...topicObject,
      project_id: topic.project_id,
      parent_topic_id: topic.id
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
      <span className={topic.status.replace(' ', '-')}>
      {topic.name}
      </span>
      <span className='buttons'>
        <button className='button' onClick={() => onTopicEdit(topic)}>edit</button>
        <button className='button' onClick={() => dispatch(deleteTopic(topic))}>delete</button>
        <button className='button' onClick={() => dispatch(updateTopicStatus(topic, 'pending'))}>pending</button>
        <button className='button' onClick={() => dispatch(updateTopicStatus(topic, 'in progress'))}>in progress</button>
        <button className='button' onClick={() => dispatch(updateTopicStatus(topic, 'done'))}>done</button>
        <button className='button' onClick={() => dispatch(updateTopicStatus(topic, 'skip'))}>skip</button>
        <button className='button' onClick={() => dispatch(updateTopicStatus(topic, 'skim'))}>skim</button>
      </span>
      {topicForm()}
      {topic.topics && topic.topics.length > 0 && (
        <ul>
          {topic.topics.map(subTopic => (
            <Topic
              key={subTopic.id}
              topic={subTopic}
              onTopicEdit={onTopicEdit}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default Topic
