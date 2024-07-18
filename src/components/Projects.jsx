import Project from './Project'

const Projects = ({ projects, onProjectDelete, onProjectEdit, onTopicDelete, onTopicEdit, onTopicAdd }) => {
  return (
    <ul>
      {
        projects.map(p =>
          <Project key={p.id} project={p} onProjectDelete={onProjectDelete} onProjectEdit={onProjectEdit} onTopicDelete={onTopicDelete} onTopicEdit={onTopicEdit} onTopicAdd={onTopicAdd} />
        )
      }
    </ul>
  )
}

export default Projects
