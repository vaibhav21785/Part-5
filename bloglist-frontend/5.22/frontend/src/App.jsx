import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {

  // States
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()


  // Fetch blogs
  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])


  // Check local storage
  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  // Login
  const handleLogin = async (event) => {
    event.preventDefault()

    try {

      const user = await loginService.login({
        username,
        password,
      })

      setUser(user)

      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      setMessage(`${user.name} logged in successfully`)

      setTimeout(() => {
        setMessage(null)
      }, 5000)

      setUsername('')
      setPassword('')

    } catch (exception) {

      setMessage('wrong username or password')

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }


  // Logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }


  // Create blog
  const addBlog = async (blogObject) => {

    try {

      const returnedBlog =
        await blogService.create(blogObject)

      returnedBlog.user = user

      blogFormRef.current.toggleVisibility()

      setBlogs(blogs.concat(returnedBlog))

      setMessage(`a new blog "${returnedBlog.title}" added`)

      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch (exception) {

      setMessage('failed to add blog')

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }


  // Like blog
  const updateLikes = async (blog) => {

    const changedBlog = {
      user: blog.user?.id || blog.user?._id || null,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    const returnedBlog =
      await blogService.update(blog.id, changedBlog)

    returnedBlog.user = blog.user

    setBlogs(prevBlogs =>
      prevBlogs.map(b =>
        b.id !== returnedBlog.id
          ? b
          : returnedBlog
      )
    )
  }


  // Remove blog
  const removeBlog = async (blog) => {

    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!confirmDelete) {
      return
    }

    try {

      await blogService.remove(blog.id)

      setBlogs(prevBlogs =>
        prevBlogs.filter(b => b.id !== blog.id)
      )

    } catch (exception) {

      setMessage('failed to delete blog')

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }


  // Login page
  if (user === null) {
    return (
      <div>

        <h2>Log in to application</h2>

        <Notification message={message} />

        <form onSubmit={handleLogin}>

          <div>
            username

            <input
              type="text"
              data-testid="username"
              value={username}
              onChange={({ target }) =>
                setUsername(target.value)
              }
            />
          </div>

          <div>
            password

            <input
              type="password"
              data-testid="password"
              value={password}
              onChange={({ target }) =>
                setPassword(target.value)
              }
            />
          </div>

          <button type="submit">
            login
          </button>

        </form>
      </div>
    )
  }


  // Blog page
  return (
    <div>

      <h2>blogs</h2>

      <Notification message={message} />

      <p>
        {user.name} logged in

        <button onClick={handleLogout}>
          logout
        </button>
      </p>


      <Togglable
        buttonLabel="new blog"
        ref={blogFormRef}
      >

        <BlogForm createBlog={addBlog} />

      </Togglable>


      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            updateLikes={updateLikes}
            removeBlog={removeBlog}
            user={user}
          />
        ))}

    </div>
  )
}

export default App