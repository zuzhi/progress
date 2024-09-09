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

  return (
    <>
      <div className='container max-w-2xl mx-auto p-4'>
        <div className="font-mono flex items-end pb-2.5">
          <NavLink
            to="/"
            className={({ isActive, isPending }) =>
              (isActive
                ? "underline"
                : isPending
                  ? "no-underline"
                  : "")
              + " text-black hover:underline"
            }
          >
            <span className='text-xl font-bold'>progress</span>
          </NavLink>
          {session
            ?
            <>
              <CustomNavLink
                to={session.user.email + "?tab=projects"}
                name="projects"
              />
              <CustomNavLink
                to={session.user.email + "?tab=archives"}
                name="archives"
              />
              <CustomNavLink
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
      </div>

      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default Root
