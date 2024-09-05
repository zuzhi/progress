import projectService from '../services/projects'
import { useLoaderData } from "react-router-dom"
import PageTitle from './PageTitle'

export const loader = async () => {
  const projectsCount = await projectService.getProjectsCount()
  const archivesCount = await projectService.getArchivesCount()

  return {
    projectsCount,
    archivesCount
  }
}

const Dashboard = () => {
  const data = useLoaderData()

  return (
    <>
      <PageTitle title="dashboard" />
      <p>
        you have {data?.projectsCount} active projects, and {data?.archivesCount} archived projects.
      </p>
    </>
  )
}
export default Dashboard
