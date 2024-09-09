import { supabase } from '../lib/initSupabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import HowToUse from "./HowToUse"
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setSession } from '../reducers/sessionReducer'
import { useNavigate } from 'react-router-dom'
import PageTitle from './PageTitle'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      dispatch(setSession(session))

      if (session) {
        navigate('/')
      }
    }
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session))
      if (session) {
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch, navigate])

  return (
    <>
      <PageTitle title="login" />
      <div className='container max-w-md sm:w-sm md:w-md mx-auto p-4'>
        <div>
          <p>
            In case you need to record the <span className="font-mono font-bold">progress</span> while getting things done.
          </p>
          <small>
            Books, Courses, Tutorials, or anything with a table of contents.
          </small>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
          />
        </div>
        <HowToUse />
      </div>
    </>
  )
}

export default LoginPage
