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
          className="mt-1 px-1 border border-gray-300 rounded-sm text-sm shadow-sm"
          ref={inputRef}
          value={newTopic}
          onChange={event => setNewTopic(event.target.value)}
        />
        <button className="pl-1.5 text-xs hover:underline text-[#828282]" type="submit">save</button>
      </form>
    </div>
  )
}

export default TopicForm
