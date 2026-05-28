import { useEffect, useState, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    const returnedBlog = await blogService.create(blogObject)

    setBlogs(blogs.concat(returnedBlog))

    setMessage(
      `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
    )

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const updateBlog = async (blogObject) => {
    const updatedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1
    }

    const returnedBlog = await blogService.update(
      blogObject.id,
      updatedBlog
    )

    setBlogs(
      blogs.map(blog =>
        blog.id !== blogObject.id ? blog : returnedBlog
      )
    )
  }

  const removeBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title}?`)) {
      await blogService.remove(blogObject.id)

      setBlogs(
        blogs.filter(blog => blog.id !== blogObject.id)
      )
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>

      <div>
        password
        <input
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>

      <button type="submit">
        login
      </button>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} />

      {!user && (
        <div>
          <h2>Log in to application</h2>
          {loginForm()}
        </div>
      )}

      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={() => {
              window.localStorage.clear()
              setUser(null)
            }}>
              logout
            </button>
          </p>

          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                removeBlog={removeBlog}
                user={user}
              />
            )}
        </div>
      )}
    </div>
  )
}

export default App