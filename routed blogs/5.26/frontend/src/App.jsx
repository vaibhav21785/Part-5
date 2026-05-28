import { useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch
} from 'react-router-dom'

function App() {

  const [user, setUser] = useState(null)

  const blogs = [
    {
      id: '1',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com',
      likes: 7
    },
    {
      id: '2',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    },
    {
      id: '3',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://example.com',
      likes: 2
    }
  ]

  const navigate = useNavigate()

  const handleLogin = (event) => {
    event.preventDefault()

    setUser({
      username: 'testuser'
    })

    navigate('/')
  }

  const handleLogout = () => {
    setUser(null)
    navigate('/')
  }

  const updateBlog = (blog) => {
    blog.likes += 1
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const Blogs = () => (
    <div>

      <h2>blogs</h2>

      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>

            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>

          </li>
        ))}
      </ul>

    </div>
  )

  const BlogView = ({ blog }) => {

    if (!blog) {
      return null
    }

    return (
      <div>

        <h2>
          {blog.title}
        </h2>

        <div>
          {blog.url}
        </div>

        <div>
          likes {blog.likes}

          {user && (
            <button
              onClick={() => updateBlog(blog)}
              style={{ marginLeft: 10 }}
            >
              like
            </button>
          )}

        </div>

        <div>
          added by {blog.author}
        </div>

      </div>
    )
  }

  const CreateBlog = () => {

    const handleCreate = (event) => {
      event.preventDefault()

      alert('new blog created')

      navigate('/')
    }

    return (
      <div>

        <h2>create new blog</h2>

        <form onSubmit={handleCreate}>

          <div>
            title
            <input />
          </div>

          <div>
            author
            <input />
          </div>

          <div>
            url
            <input />
          </div>

          <button type="submit">
            create
          </button>

        </form>

      </div>
    )
  }

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

        <Link
          to="/"
          style={{ marginRight: 10 }}
        >

          blogs
        </Link>

        <Link
          to="/create"
          style={{ marginRight: 10 }}
        >
          create new
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

        <Route
          path="/create"
          element={<CreateBlog />}
        />

        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blog={blog}
            />
          }
        />

      </Routes>

    </div>
  )
}

export default App