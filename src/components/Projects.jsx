import Project from './Project'

const Projects = ({
  projects,
  onProjectDelete,
  onProjectEdit,
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
