import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"

const ProjectEditForm = forwardRef(({ onProjectUpdate, isVisible }, refs) => {
  const [id, setId] = useState('')
  const [newProject, setNewProject] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isVisible) {
      const scrollToTopAndFocus = () => {
        const focusInput = () => {
          inputRef.current.focus()
          inputRef.current.setSelectionRange(
            inputRef.current.value.length,
            inputRef.current.value.length
          )
        }

        if (window.scrollY === 0) {
          focusInput()
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          const handleScroll = () => {
            if (window.scrollY === 0) {
              focusInput()
              window.removeEventListener('scroll', handleScroll)
            }
          }
          window.addEventListener('scroll', handleScroll)
        }
      }

      scrollToTopAndFocus()
    }
  }, [isVisible])

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
      <p className="font-bold">edit project</p>
      <form onSubmit={onSubmit}>
        <input
          hidden
          value={id}
          onChange={event => setId(event.target.value)}
        />
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
})
ProjectEditForm.displayName = 'ProjectEditForm'

export default ProjectEditForm
