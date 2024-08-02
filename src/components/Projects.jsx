import Project from './Project'

const Projects = ({
  projects,
  onProjectDelete,
  onProjectEdit,
  onProjectArchive,
  onTopicDelete,
  onTopicEdit,
  onTopicAdd,
  onTopicStatusChange
}) => {
  return (
    <ul>
      {
        projects.map(p =>
          <Project
            key={p.id}
            project={p}
            onProjectDelete={onProjectDelete}
            onProjectEdit={onProjectEdit}
            onProjectArchive={onProjectArchive}
            onTopicDelete={onTopicDelete}
            onTopicEdit={onTopicEdit}
            onTopicAdd={onTopicAdd}
            onTopicStatusChange={onTopicStatusChange}
          />
        )
      }
    </ul>
  )
}

export default Projects
