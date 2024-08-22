import { useDispatch, useSelector } from 'react-redux'
import { unarchiveProject } from '../reducers/projectReducer'
import { countTopics } from '../lib/util'
import { useState } from 'react'

const Topic = ({ topic }) => {
  return (
    <li>
      <span className={topic.status.replace(' ', '-')}>
        {topic.name}
      </span>
      {topic.topics && topic.topics.length > 0 && (
        <ul>
          {topic.topics.map(subTopic => (
            <Topic
              key={subTopic.id}
              topic={subTopic}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

const Project = ({ project }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const dispatch = useDispatch()

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <li>
      <span className='project'>
        {project.name} - {project.progress}%
      </span>
      <span className='buttons'>
        <button className='button' onClick={() => dispatch(unarchiveProject(project))}>unarchive</button>
      </span>
      <button className='button' onClick={toggleCollapse}>
        {isCollapsed ? '[' + (project.topics ? project.topics.length : 0) + ' more]' : '[-]'}
      </button>
      {!isCollapsed && (
        <div className='collapseContent'>
          {
            project.topics && (
              <ul>
                {project.topics.map(topic => (
                  <Topic
                    key={topic.id}
                    topic={topic}
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

const Projects = () => {
  const archives = useSelector(state => state.projects.archives)
  return (
    <ul>
      {
        archives.map(project =>
          <Project
            key={project.id}
            project={project}
          />
        )
      }
    </ul>
  )
}

const Archives = () => {
  return (
    <>
      <p><b>archives</b></p>
      <Projects />
    </>
  )
}

export default Archives
