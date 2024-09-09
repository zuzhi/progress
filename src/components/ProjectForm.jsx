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
        {/* <p className="font-bold">new project</p> */}
        <input
          className="mt-1 px-1 border border-gray-300 rounded-sm text-sm shadow-sm"
          ref={inputRef}
          value={newProject}
          onChange={event => setNewProject(event.target.value)}
        />
        <button className="font-mono pl-1.5 text-xs hover:underline text-[#828282]" type="submit">save</button>
      </form>
    </div>
  )
}

export default ProjectForm
