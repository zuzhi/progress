import { NavLink, useLocation } from 'react-router-dom'

function CustomNavLink({ padding, to, name }) {
  const location = useLocation()

  // Extract the `tab` parameter from the current URL
  const searchParams = new URLSearchParams(location.search)
  const currentTab = searchParams.get('tab') ?? 'profile'

  return (
    <NavLink
      style={padding}
      to={to}
      className={({ isActive, isPending }) => {
        // Check if the current tab matches 'projects'
        const isActiveTab = isActive && currentTab === name
        return isActiveTab
          ? "active"
          : isPending
          ? "pending"
          : ""
      }}
    >
      {name}
    </NavLink>
  )
}

export default CustomNavLink
