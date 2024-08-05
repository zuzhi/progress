import { useState, useRef, useEffect } from "react"

const TopicForm = ({ createTopic, isVisible }) => {
  const [newTopic, setNewTopic] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isVisible) {
      inputRef.current.focus()
    }
  }, [isVisible])

  const addTopic = (event) => {
    event.preventDefault()
    createTopic({
      name: newTopic
    })

    setNewTopic('')
  }

  return (
    <div>
      <form onSubmit={addTopic}>
        <input
          ref={inputRef}
          value={newTopic}
          onChange={event => setNewTopic(event.target.value)}
        />
        <button type="submit">&nbsp;save</button>
      </form>
    </div>
  )
}

export default TopicForm
