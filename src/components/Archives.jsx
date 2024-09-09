import { useDispatch } from 'react-redux'
import { deleteProject, unarchiveProject } from '../reducers/projectReducer'
import { useState } from 'react'
import PageTitle from './PageTitle'

const Topic = ({ topic }) => {
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
      {topic.topics && topic.topics.length > 0 && (
        <ul className='pl-4 list-disc list-outside'>
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
      <span className='text-[#828282]'>
        {project.name} - {project.progress}%
      </span>
      <span className='buttons'>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(deleteProject(project))}>delete</button>
        <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={() => dispatch(unarchiveProject(project))}>unarchive</button>
      </span>
      <button className='pl-1.5 text-xs hover:underline text-[#828282]' onClick={toggleCollapse}>
        {isCollapsed ? '[' + (project.topics ? project.topics.length : 0) + ' more]' : '[-]'}
      </button>
      {!isCollapsed && (
        <div className='collapseContent'>
          {
            project.topics && (
              <ul className='pl-4 list-disc list-outside'>
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

const Projects = ({ archives }) => {
  return (
    <ul className='pl-4 list-disc list-outside [&_ul]:list-[revert]'>
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

const Archives = ({ archives }) => {
  return (
    <>
      <PageTitle title="archives" />
      <Projects archives={archives} />
    </>
  )
}

export default Archives
