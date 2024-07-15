import { useState, forwardRef, useImperativeHandle } from "react"

const ProjectEditForm = forwardRef(({ updateProject }, refs) => {
  const [id, setId] = useState('')
  const [newProject, setNewProject] = useState('')

  useImperativeHandle(refs, () => {
    return {
      setId,
      setNewProject
    }
  })

  const onProjectUpdate = (event) => {
    event.preventDefault()
    updateProject({
      id: id,
      name: newProject
    })

    setNewProject('')
  }

  return (
    <div>
      <h3>Edit project</h3>
      <form onSubmit={onProjectUpdate}>
        <input
          hidden
          value={id}
          onChange={event => setId(event.target.value)}
        />
        <input
          value={newProject}
          onChange={event => setNewProject(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
})
ProjectEditForm.displayName = 'ProjectEditForm'

export default ProjectEditForm
