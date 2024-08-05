import { useState, useRef, useEffect } from "react"

const ProjectForm = ({ onProjectCreate, isVisible }) => {
  const [newProject, setNewProject] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isVisible) {
      inputRef.current.focus()
    }
  }, [isVisible])

  const onSubmit = (event) => {
    event.preventDefault()
    onProjectCreate({
      name: newProject
    })

    setNewProject('')
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          value={newProject}
          onChange={event => setNewProject(event.target.value)}
        />
        <button type="submit">&nbsp;save</button>
      </form>
    </div>
  )
}

export default ProjectForm
