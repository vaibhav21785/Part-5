import { useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom'

function App() {

  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  const handleLogin = (event) => {
    event.preventDefault()

    // fake login
    setUser({
      username: 'testuser'
    })

    navigate('/')
  }

  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }

  const Blogs = () => (
    <div>
      <h2>blogs</h2>

      <ul>
        <li>React patterns</li>
        <li>Go To Statement Considered Harmful</li>
        <li>Canonical string reduction</li>
      </ul>
    </div>
  )

  const Login = () => (
    <div>
      <h2>login</h2>

      <form onSubmit={handleLogin}>

        <div>
          username
          <input />
        </div>

        <div>
          password
          <input type="password" />
        </div>

        <button type="submit">
          login
        </button>

      </form>
    </div>
  )

  return (
    <div>

      <div
        style={{
          padding: 5,
          background: '#ddd',
          marginBottom: 10
        }}
      >

        <Link to="/" style={{ marginRight: 10 }}>
          blogs
        </Link>

        <Link to="/login">
          login
        </Link>

        {user && (
          <button
            onClick={handleLogout}
            style={{ marginLeft: 10 }}
          >
            logout
          </button>
        )}

      </div>

      <Routes>

        <Route
          path="/"
          element={<Blogs />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>

    </div>
  )
}

export default App