import { useLocation } from "react-router-dom"
import PageTitle from "./PageTitle"

const ErrorPage = () => {
  const location = useLocation()

  return (
    <>
      <PageTitle title="404" />
      <div className="font-mono text-[#828282]">
        <p>
          <i>{location.pathname} =&gt; </i>
          404 Not Found
        </p>
      </div>
    </>
  )
}

export default ErrorPage
