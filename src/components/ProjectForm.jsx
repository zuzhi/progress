import { useState } from "react"

const ProjectForm = ({ onProjectCreate }) => {
  const [newProject, setNewProject] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    onProjectCreate({
      name: newProject
    })

    setNewProject('')
  }


  return (
    <div>
      <h3>Create a new project</h3>
      <form onSubmit={onSubmit}>
        <input
          value={newProject}
          onChange={event => setNewProject(event.target.value)}
        />
        <button type="submit">&nbsp;save</button>
      </form>
    </div>
  )
}

export default ProjectForm
