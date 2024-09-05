import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store.js'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import Dashboard, {
  loader as dashboardLoader
} from './components/Dashboard.jsx'
import Profile, {
  loader as profileLoader
} from './components/Profile.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import Root from './components/Root.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        loader: dashboardLoader
      },
      {
        path: ":username",
        element: <Profile />,
        loader: profileLoader
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}>
    </RouterProvider>
  </Provider>
)
