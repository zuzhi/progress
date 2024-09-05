import { supabase } from '../lib/initSupabase'
import { useEffect } from "react"
import { setSession } from "../reducers/sessionReducer"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import CustomNavLink from './CustomNavLink'
import Footer from './Footer'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

const Root = () => {
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
          ?
          <>
            <CustomNavLink
              padding={padding}
              to={session.user.email + "?tab=projects"}
              name="projects"
            />
            <CustomNavLink
              padding={padding}
              to={session.user.email + "?tab=archives"}
              name="archives"
            />
            <CustomNavLink
              padding={padding}
              to={session.user?.email}
              name="profile"
            />
          </>
          : <></>
        }
      </div>

      {/* all the other elements  */}
      <div id="detail">
        <Outlet />
      </div>

      <Footer />

      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default Root
