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
      <p><b>Edit project</b></p>
      <form onSubmit={onSubmit}>
        <input
          hidden
          value={id}
          onChange={event => setId(event.target.value)}
        />
        <input
          ref={inputRef}
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
