import Project from './Project'

const Projects = ({ projects, onProjectDelete, onProjectEdit }) => {
  return (
    <ul>
      {
        projects.map(p =>
          <Project key={p.id} project={p} onDelete={onProjectDelete} onEdit={onProjectEdit} />
        )
      }
    </ul>
  )
}

export default Projects
