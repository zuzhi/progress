import { render, screen } from '@testing-library/react'
import TopicEditForm from './TopicEditForm'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('<TopicEditForm /> updates parent state and calls onSubmit', async () => {
  const onTopicUpdate = vi.fn()
  const user = userEvent.setup()

  render(<TopicEditForm onTopicUpdate={onTopicUpdate} isVisible={true} />)

  const input = screen.getByRole('textbox')
  expect(input).toHaveFocus()

  const sendButton = screen.getByText('save', { exact: false })

  await user.clear(input)
  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(onTopicUpdate.mock.calls).toHaveLength(1)
  expect(onTopicUpdate.mock.calls[0][0].name).toBe('testing a form...')
})
