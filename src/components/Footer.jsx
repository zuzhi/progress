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
      <span className="text-xs text-[#828282]">
        {session?.user.email} |
      </span>
      <button
        className='pl-1.5 text-xs hover:underline text-[#828282]'
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
