import { useState } from "react"

const ProjectForm = ({ createProject }) => {
  const [newProject, setNewProject] = useState('')

  const addProject = (event) => {
    event.preventDefault()
    createProject({
      name: newProject
    })

    setNewProject('')
  }


  return (
    <div>
      <h3>Create a new project</h3>
      <form onSubmit={addProject}>
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
