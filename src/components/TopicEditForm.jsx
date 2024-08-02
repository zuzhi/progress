import { useState, forwardRef, useImperativeHandle } from "react"

const TopicEditForm = forwardRef(({ onTopicUpdate }, refs) => {
  const [id, setId] = useState('')
  const [newTopic, setNewTopic] = useState('')

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
          value={newTopic}
          onChange={event => setNewTopic(event.target.value)}
        />
        <button type="submit">&nbsp;save</button>
      </form>
    </div>
  )
})
TopicEditForm.displayName = 'TopicEditForm'

export default TopicEditForm
