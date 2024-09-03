import { supabase } from './lib/initSupabase'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import './App.css'
import Footer from './components/Footer'
import { NavLink, Route, Routes, useNavigate } from "react-router-dom"
import Archives from "./components/Archives"
import LoginPage from "./components/LoginPage"
import { useDispatch, useSelector } from "react-redux"
import ProjectsPage from "./components/ProjectsPage"
import { useEffect } from "react"
import { setSession } from "./reducers/sessionReducer"
import ErrorPage from './components/ErrorPage'

function App() {
  const dispatch = useDispatch()
  const session = useSelector(state => state.session)
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      dispatch(setSession(session))

      if (!session) {
        navigate('/login')
      }
    }
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
      if (!session) {
        navigate('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch, navigate])

  const padding = {
    paddingLeft: 10
  }

  return (
    <>
      <div className="header">
        <NavLink
          to="/"
          className={({ isActive, isPending }) =>
            (isActive
              ? "active"
              : isPending
                ? "pending"
                : "")
            + " product-name"
          }
        >
          <b>progress</b>
        </NavLink>
        {session
          ? <NavLink
            style={padding}
            to="/archives"
            className={({ isActive, isPending }) =>
              isActive
                ? "active"
                : isPending
                  ? "pending"
                  : ""
            }
          >
            archives
          </NavLink>
          : <></>
        }
      </div>

      <Routes>
        <Route path="/" element={<ProjectsPage />} /> {/* '/' auth ? dashboard : homepage */}
        {/* ':user-name?tab=projects' projects */}
        <Route path="/archives" element={<Archives />} /> {/* ':user-name?tab=archives' archives */}
        {/* ':user-name' profile */}
        {/* ':user-name/:project-name' archived ? archived project : project */}
        <Route path="/login" element={<LoginPage />} /> {/* '/login' login */}
        <Route path="*" element={<ErrorPage />} /> {/* '/*' everything else */}
      </Routes>

      {session
        ? <Footer />
        : <></>
      }

      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
