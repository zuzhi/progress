import { render, screen } from '@testing-library/react'
import Project from './Project'
import { userEvent } from '@testing-library/user-event'
import { expect } from 'vitest'

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
  screen.debug(button)
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
  screen.debug(button)
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
  screen.debug(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
