import { useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch
} from 'react-router-dom'

import './index.css'

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
      url: 'http://example.com',
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

      <ul className="blog-list">
        {blogs.map(blog => (
          <li
            key={blog.id}
            className="blog-item"
          >
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
    <div className="blog-view">

      <h2 className="blog-title">
        {blog.title}
      </h2>

      <p className="blog-author">
        by {blog.author}
      </p>

      <a
        href={blog.url}
        target="_blank"
        rel="noreferrer"
        className="blog-link"
      >
        {blog.url}
      </a>

      <p className="blog-added">
        Added by {blog.author}
      </p>

      <div className="blog-actions">

        <span className="likes">
          {blog.likes} likes
        </span>

        {user && (
          <button
            onClick={() => updateBlog(blog.id)}
            className="like-button"
          >
            LIKE
          </button>
        )}

        {user && (
          <button
            onClick={() => removeBlog(blog.id)}
            className="remove-button"
          >
            REMOVE
          </button>
        )}

      </div>

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
      <div className="form-container">

        <h2>Create new blog</h2>

        <form onSubmit={handleCreate}>

          <div className="form-group">
            <label>title</label>

            <input
              name="title"
              className="input"
            />
          </div>

          <div className="form-group">
            <label>author</label>

            <input
              name="author"
              className="input"
            />
          </div>

          <div className="form-group">
            <label>url</label>

            <input
              name="url"
              className="input"
            />
          </div>

          <button
            type="submit"
            className="button"
          >
            create
          </button>

        </form>

      </div>
    )
  }

  const Login = () => (
    <div className="form-container">

      <h2>Log in to application</h2>

      <form onSubmit={handleLogin}>

        <div className="form-group">
          <label>username</label>

          <input className="input" />
        </div>

        <div className="form-group">
          <label>password</label>

          <input
            type="password"
            className="input"
          />
        </div>

        <button
          type="submit"
          className="button"
        >
          login
        </button>

      </form>

    </div>
  )

  return (
    <div className="container">

      <div className="navbar">

        <Link
          to="/"
          className="nav-link"
        >
          blogs
        </Link>

        {user && (
          <Link
            to="/create"
            className="nav-link"
          >
            create new
          </Link>
        )}

        {!user && (
          <Link
            to="/login"
            className="nav-link"
          >
            login
          </Link>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="logout-button"
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
          element={<BlogView blog={blog} />}
        />

      </Routes>

    </div>
  )
}

export default App