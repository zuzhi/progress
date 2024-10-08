import { render, screen } from '@testing-library/react'
import ProjectForm from './ProjectForm'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('<ProjectForm /> updates parent state and calls onSubmit', async () => {
  const onProjectCreate = vi.fn()
  const user = userEvent.setup()

  render(<ProjectForm onProjectCreate={onProjectCreate} isVisible={true} />)

  const input = screen.getByRole('textbox')
  expect(input).toHaveFocus()

  const sendButton = screen.getByText('save', { exact: false })

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(onProjectCreate.mock.calls).toHaveLength(1)
  expect(onProjectCreate.mock.calls[0][0].name).toBe('testing a form...')
})
