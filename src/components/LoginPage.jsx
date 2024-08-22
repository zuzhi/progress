import { supabase } from '../lib/initSupabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import HowToUse from "./HowToUse"
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setSession } from '../reducers/sessionReducer'
import { useNavigate } from 'react-router-dom'

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
      <div className='auth-form'>
        <p>
          In case you need to record the <strong>progress</strong> while getting things done.
        </p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
      <HowToUse />
    </>
  )
}

export default LoginPage
