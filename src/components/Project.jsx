const Project = ({ project, onDelete, onEdit }) => {
  return (
    <li>
      {project.name}
      <button onClick={() => onEdit(project)}>edit</button>
      <button onClick={() => onDelete(project)}>delete</button>
    </li>
  )
}

export default Project
