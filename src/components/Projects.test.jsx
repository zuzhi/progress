import { render, screen } from "@testing-library/react"
import Projects from "./Projects"
import { expect } from "vitest"

test('render projects', () => {
  const projects = [
    {
      id: 10000,
      name: 'a project',
      progress: 0
    },
    {
      id: 10001,
      name: 'another project',
      progress: 1
    }
  ]

  render(<Projects projects={projects} />)

  const project1 = screen.getByText('a project - 0%')
  const project2 = screen.getByText('another project - 1%')

  expect(project1).toBeDefined()
  expect(project2).toBeDefined()
})
