import { useState, useRef, useEffect } from "react"

const TopicForm = ({ onTopicCreate, isVisible }) => {
  const [newTopic, setNewTopic] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isVisible) {
      inputRef.current.focus()
    }
  }, [isVisible])

  const addTopic = (event) => {
    event.preventDefault()
    onTopicCreate({
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
        <button className="button" type="submit">save</button>
      </form>
    </div>
  )
}

export default TopicForm
