import { useState, forwardRef, useImperativeHandle } from "react"

const TopicEditForm = forwardRef(({ updateTopic }, refs) => {
  const [id, setId] = useState('')
  const [newTopic, setNewTopic] = useState('')

  useImperativeHandle(refs, () => {
    return {
      setId,
      setNewTopic
    }
  })

  const onTopicUpdate = (event) => {
    event.preventDefault()
    updateTopic({
      id: id,
      name: newTopic
    })

    setNewTopic('')
  }

  return (
    <div>
      <h3>Edit topic</h3>
      <form onSubmit={onTopicUpdate}>
        <input
          hidden
          value={id}
          onChange={event => setId(event.target.value)}
        />
        <input
          value={newTopic}
          onChange={event => setNewTopic(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
})
TopicEditForm.displayName = 'TopicEditForm'

export default TopicEditForm
