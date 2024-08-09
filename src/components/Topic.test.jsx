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

test('clicking the save button of topic form calls event handler once', async () => {
  const topic = {
    name: 'Component testing is done with react-testing-library',
    status: 'pending'
  }

  const addTopic = vi.fn()

  render(<Topic topic={topic} onTopicAdd={addTopic} />)

  // toggle topic form
  const user = userEvent.setup()
  const button = screen.getByText('new sub-topic')
  await user.click(button)

  // simulating user input
  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(addTopic.mock.calls).toHaveLength(1)
  expect(addTopic.mock.calls[0][0].name).toBe('testing a form...')
})

test('topic with sub topics', () => {
  const topic = {
    id: 1,
    name: 'Component testing is done with react-testing-library',
    status: 'pending',
    subTopics: [
      {
        id: 2,
        name: 'a sub topic',
        status: 'pending'
      },
      {
        id: 3,
        name: 'another sub topic',
        status: 'pending'
      }
    ]
  }

  render(<Topic key={topic.id} topic={topic} />)

  const element = screen.getByText('a sub topic')
  expect(element).toBeDefined()
})
