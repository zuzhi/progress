import { useDispatch, useSelector } from 'react-redux'
import Project from './Project'
import { archiveProject, deleteProject } from '../reducers/projectReducer'

const Projects = ({
  onProjectEdit,
  onTopicEdit,
  onTopicAdd,
  openInEditor
}) => {

  const dispatch = useDispatch()
  const projects = useSelector(state => state.projects.list)

  return (
    <ul>
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
          />
        )
      }
    </ul>
  )
}

export default Projects
