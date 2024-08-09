import { render, screen } from '@testing-library/react'
import Project from './Project'
import { userEvent } from '@testing-library/user-event'
import { describe, expect } from 'vitest'

test('renders content', () => {
  const project = {
    name: 'Component testing is done with react-testing-library',
    progress: 0
  }

  render(<Project project={project} />)
  const element = screen.getByText('Component testing is done with react-testing-library - 0%')
  expect(element).toBeDefined()
})

test('clicking the edit button calls event handler once', async () => {
  const project = {
    name: 'Component testing is done with react-testing-library',
    progress: 0
  }

  const mockHandler = vi.fn()

  render(<Project project={project} onProjectEdit={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('edit')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('clicking the delete button calls event handler once', async () => {
  const project = {
    name: 'Component testing is done with react-testing-library',
    progress: 0
  }

  const mockHandler = vi.fn()

  render(<Project project={project} onProjectDelete={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('delete')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('clicking the archive button calls event handler once', async () => {
  const project = {
    name: 'Component testing is done with react-testing-library',
    progress: 0
  }

  const mockHandler = vi.fn()

  render(<Project project={project} onProjectArchive={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('archive')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

describe('collapse', () => {
  test('before clicking the [-](collapse) button, .collapseContent rendered)', async () => {
    const project = {
      name: 'Component testing is done with react-testing-library',
      progress: 0
    }

    const container = render(<Project project={project} />).container

    const collapseContent = container.querySelector('.collapseContent')
    expect(collapseContent).toBeDefined()
  })

  test('after clicking the [-](collapse) button, .collapseContent not rendered', async () => {
    const project = {
      name: 'Component testing is done with react-testing-library',
      progress: 0
    }

    const container = render(<Project project={project} />).container

    const user = userEvent.setup()
    const button = screen.getByText('[-]', { exact: false })
    await user.click(button)

    const collapseContent = container.querySelector('.collapseContent')
    expect(collapseContent).toBeNull()
  })
})

test('clicking the save button of topic form calls event handler once', async () => {
  const project = {
    id: 10000,
    name: 'Component testing is done with react-testing-library',
    progress: 0
  }

  const addTopic = vi.fn()

  render(<Project project={project} onTopicAdd={addTopic} />)

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

test('project with sub topics', () => {
  const project = {
    id: 10000,
    name: 'Component testing is done with react-testing-library',
    progress: 0,
    topics: [
      {
        id: 1,
        name: 'a sub topic',
        status: 'pending'
      },
      {
        id: 2,
        name: 'another sub topic',
        status: 'pending'
      }
    ]
  }

  render(<Project key={project.id} project={project} />)

  const element = screen.getByText('a sub topic')
  expect(element).toBeDefined()
})
