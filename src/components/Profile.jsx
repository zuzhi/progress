import { useLoaderData } from "react-router-dom"
import Archives from "./Archives"
import { fetchArchives, fetchProjects } from "../reducers/projectReducer"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import ProjectsPage from "./ProjectsPage"
import PageTitle from "./PageTitle"

export const loader = async ({ params, request }) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const tab = searchParams.get('tab') ?? 'profile'
  console.log("tab:", tab)

  return {
    username: params.username,
    url: url,
    tab: tab,
  }
}

const Profile = () => {
  const session = useSelector(state => state.session)
  const { username, tab } = useLoaderData()

  const dispatch = useDispatch()
  useEffect(() => {
    if (tab === 'projects') {
      dispatch(fetchProjects())
    }
    if (tab === 'archives') {
      dispatch(fetchArchives())
    }
  }, [dispatch, tab])

  const projects = useSelector(state => state.projects.list)
  const archives = useSelector(state => state.projects.archives)
  console.log("projects:", projects)
  console.log("archives:", archives)

  // If the session is still loading or undefined, show a loading state
  if (!session?.user) {
    return <div>Loading...</div>
  }

  if (username !== session?.user.email) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    })
  }

  switch (tab) {
    case 'archives':
      return <Archives archives={archives} />
    case 'projects':
      return <ProjectsPage projects={projects} />
    default:
      return <>
        <PageTitle title="profile" />
        <p>
          hi, {username}
        </p>
      </>
  }
}

export default Profile
