import { useState, forwardRef, useImperativeHandle } from "react"

const ProjectEditForm = forwardRef(({ onProjectUpdate }, refs) => {
  const [id, setId] = useState('')
  const [newProject, setNewProject] = useState('')

  useImperativeHandle(refs, () => {
    return {
      setId,
      setNewProject
    }
  })

  const onSubmit = (event) => {
    event.preventDefault()
    onProjectUpdate({
      id: id,
      name: newProject
    })

    setNewProject('')
  }

  return (
    <div>
      <p><b>Edit project</b></p>
      <form onSubmit={onSubmit}>
        <input
          hidden
          value={id}
          onChange={event => setId(event.target.value)}
        />
        <input
          value={newProject}
          onChange={event => setNewProject(event.target.value)}
        />
        <button type="submit">&nbsp;save</button>
      </form>
    </div>
  )
})
ProjectEditForm.displayName = 'ProjectEditForm'

export default ProjectEditForm
