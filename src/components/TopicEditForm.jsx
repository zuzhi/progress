import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react"

const TopicEditForm = forwardRef(({ onTopicUpdate, isVisible }, refs) => {
  const [id, setId] = useState('')
  const [newTopic, setNewTopic] = useState('')
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
      setNewTopic
    }
  })

  const onSubmit = (event) => {
    event.preventDefault()
    onTopicUpdate({
      id: id,
      name: newTopic
    })

    setNewTopic('')
  }

  return (
    <div>
      <p><b>Edit topic</b></p>
      <form onSubmit={onSubmit}>
        <input
          hidden
          value={id}
          onChange={event => setId(event.target.value)}
        />
        <input
          ref={inputRef}
          value={newTopic}
          onChange={event => setNewTopic(event.target.value)}
        />
        <button className="button" type="submit">save</button>
      </form>
    </div>
  )
})
TopicEditForm.displayName = 'TopicEditForm'

export default TopicEditForm
