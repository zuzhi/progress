import { render, screen } from '@testing-library/react'
import Topic from './Topic'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'vitest'

test('renders content', () => {
  const topic = {
    name: 'Component testing is done with react-testing-library',
    status: 'in progress'
  }

  render(<Topic topic={topic} />)
  const element = screen.getByText('Component testing is done with react-testing-library')
  screen.debug(element)
  expect(element).toBeDefined()
  expect(element).toHaveClass('in-progress')
})

test('clicking each button calls event handler once', async () => {
  const topic = {
    name: 'Component testing is done with react-testing-library',
    status: 'in progress'
  }

  const mockHandler = vi.fn()

  render(
    <Topic
      topic={topic}
      onTopicEdit={mockHandler}
      onTopicDelete={mockHandler}
      onTopicStatusChange={mockHandler}
    />)

  const user = userEvent.setup()

  const editButton = screen.getByText('edit')
  await user.click(editButton)

  const deleteButton = screen.getByText('delete')
  await user.click(deleteButton)

  const statusPendingButton = screen.getByText('pending')
  await user.click(statusPendingButton)

  const statusInProgressButton = screen.getByText('in progress')
  await user.click(statusInProgressButton)

  const statusDoneButton = screen.getByText('done')
  await user.click(statusDoneButton)

  const statusSkipButton = screen.getByText('skip')
  await user.click(statusSkipButton)

  const statusSkimButton = screen.getByText('skim')
  await user.click(statusSkimButton)

  expect(mockHandler.mock.calls).toHaveLength(7)
})
