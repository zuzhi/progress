import { NavLink, useLocation } from 'react-router-dom'

function CustomNavLink({ to, name }) {
  const location = useLocation()

  // Extract the `tab` parameter from the current URL
  const searchParams = new URLSearchParams(location.search)
  const currentTab = searchParams.get('tab') ?? 'profile'

  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) => {
        // Check if the current tab matches 'projects'
        const isActiveTab = isActive && currentTab === name
        return (isActiveTab
          ? "underline"
          : isPending
            ? "no-underline"
            : "")
          + " text-xs hover:underline pl-2.5"
      }}
    >
      {name}
    </NavLink>
  )
}

export default CustomNavLink
