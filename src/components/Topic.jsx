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
    dispatch(createTopic(topicToSave, session?.user?.id))
  }

  const topicForm = () => (
    <Togglable buttonLabel='new sub-topic' ref={topicFormRef} onVisibleChange={handleTopicFormVisibleChange}>
      <TopicForm onTopicCreate={handleTopicCreate} isVisible={topicFormVisible} />
    </Togglable>
  )

  const statusClasses = {
    done: 'line-through',
    pendig: '',
    'in progress': 'font-medium',
    skip: 'text-[#828282]',
    skim: 'text-[#828282] line-through'
  }

  return (
    <li>
      <span className={statusClasses[topic.status]}>
        {topic.name}
      </span>
      <span className='buttons'>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => onTopicEdit(topic)}>edit</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(deleteTopic(topic))}>delete</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(updateTopicStatus(topic, 'pending'))}>pending</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(updateTopicStatus(topic, 'in progress'))}>in progress</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(updateTopicStatus(topic, 'done'))}>done</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(updateTopicStatus(topic, 'skip'))}>skip</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(updateTopicStatus(topic, 'skim'))}>skim</button>
      </span>
      {topicForm()}
      {topic.topics && topic.topics.length > 0 && (
        <ul className='pl-4 list-disc list-outside space-y-1'>
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
