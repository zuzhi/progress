import { render, screen } from '@testing-library/react'
import ProjectEditForm from './ProjectEditForm'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('<ProjectEditForm /> updates parent state and calls onSubmit', async () => {
  const onProjectUpdate = vi.fn()
  const user = userEvent.setup()

  render(<ProjectEditForm onProjectUpdate={onProjectUpdate} isVisible={true} />)

  const input = screen.getByRole('textbox')
  expect(input).toHaveFocus()

  const sendButton = screen.getByText('save', { exact: false })

  await user.clear(input)
  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(onProjectUpdate.mock.calls).toHaveLength(1)
  expect(onProjectUpdate.mock.calls[0][0].name).toBe('testing a form...')
})
