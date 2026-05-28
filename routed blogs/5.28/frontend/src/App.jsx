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

  const [blogs, setBlogs] = useState([
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
  ])

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

  const updateBlog = (id) => {

    const updatedBlogs = blogs.map(blog =>
      blog.id === id
        ? { ...blog, likes: blog.likes + 1 }
        : blog
    )

    setBlogs(updatedBlogs)
  }

  const removeBlog = (id) => {

    const updatedBlogs = blogs.filter(
      blog => blog.id !== id
    )

    setBlogs(updatedBlogs)

    navigate('/')
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
              onClick={() => updateBlog(blog.id)}
              style={{ marginLeft: 10 }}
            >
              like
            </button>
          )}

        </div>

        <div>
          added by {blog.author}
        </div>

        {user && (
          <button
            onClick={() => removeBlog(blog.id)}
            style={{ marginTop: 10 }}
          >
            remove
          </button>
        )}

      </div>
    )
  }

  const CreateBlog = () => {

    const handleCreate = (event) => {
      event.preventDefault()

      const newBlog = {
        id: String(blogs.length + 1),
        title: event.target.title.value,
        author: event.target.author.value,
        url: event.target.url.value,
        likes: 0
      }

      setBlogs(blogs.concat(newBlog))

      navigate('/')
    }

    return (
      <div>

        <h2>create new blog</h2>

        <form onSubmit={handleCreate}>

          <div>
            title
            <input name="title" />
          </div>

          <div>
            author
            <input name="author" />
          </div>

          <div>
            url
            <input name="url" />
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

        {user && (
          <Link
            to="/create"
            style={{ marginRight: 10 }}
          >
            create new
          </Link>
        )}

        {!user && (
          <Link to="/login">
            login
          </Link>
        )}

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