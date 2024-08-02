import { useState } from "react"

const TopicForm = ({ createTopic }) => {
  const [newTopic, setNewTopic] = useState('')

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
          value={newTopic}
          onChange={event => setNewTopic(event.target.value)}
        />
        <button type="submit">&nbsp;save</button>
      </form>
    </div>
  )
}

export default TopicForm
