import { render, screen } from '@testing-library/react'
import TopicForm from './TopicForm'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('<TopicForm /> updates parent state and calls onSubmit', async () => {
  const onTopicCreate = vi.fn()
  const user = userEvent.setup()

  render(<TopicForm onTopicCreate={onTopicCreate} isVisible={true} />)

  const input = screen.getByRole('textbox')
  expect(input).toHaveFocus()

  const sendButton = screen.getByText('save', { exact: false })

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(onTopicCreate.mock.calls).toHaveLength(1)
  expect(onTopicCreate.mock.calls[0][0].name).toBe('testing a form...')
})
