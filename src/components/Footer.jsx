import { useDispatch, useSelector } from "react-redux"
import { supabase } from '../lib/initSupabase'
import { clearSelectedProject, setArchives, setProjects } from "../reducers/projectReducer"
import { useNavigate } from "react-router-dom"

const Footer = () => {
  const dispatch = useDispatch()
  const session = useSelector(state => state.session)
  const navigate = useNavigate()

  return (
    < div >
      <span className="footer">
        {session?.user.email.split('@')[0]} |
      </span>
      <button
        className='button'
        onClick={async () => {
          const { error } = await supabase.auth.signOut()
          if (error) {
            console.log('error logging out:', error.message)
          } else {
            dispatch(setProjects([]))
            dispatch(setArchives([]))
            dispatch(clearSelectedProject())
            navigate('/login')
          }
        }}
      >
        logout
      </button>
    </div >
  )
}

export default Footer
