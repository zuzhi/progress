import Project from './Project'
import { archiveProject, deleteProject } from '../reducers/projectReducer'
import { useDispatch } from 'react-redux'

const Projects = ({
  projects,
  onProjectEdit,
  onTopicEdit,
  onTopicAdd,
  openInEditor,
  viewAsTree
}) => {

  const dispatch = useDispatch()

  return (
    <ul className='pl-4 list-disc list-outside [&_ul]:list-[revert]'>
      {
        projects.map(project =>
          <Project
            key={project.id}
            project={project}
            handleProjectDelete={() =>
              dispatch(deleteProject(project))
            }
            handleProjectEdit={onProjectEdit}
            handleProjectArchive={() =>
              dispatch(archiveProject(project))
            }
            onTopicEdit={onTopicEdit}
            onTopicAdd={onTopicAdd}
            openInEditor={openInEditor}
            viewAsTree={viewAsTree}
          />
        )
      }
    </ul>
  )
}

export default Projects
