import { useState, useEffect } from 'react'
import { useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'


import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {

  // States
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const blogObject = {
        title,
        author,
        url,
      }

      const returnedBlog =
        await blogService.create(blogObject)
        blogFormRef.current.toggleVisibility()

      setBlogs(blogs.concat(returnedBlog))

      setMessage(`a new blog "${returnedBlog.title}" added`)

      setTimeout(() => {
        setMessage(null)
      }, 5000)

      setTitle('')
      setAuthor('')
      setUrl('')

    } catch (exception) {

      setMessage('failed to add blog')

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


      <h2>create new</h2>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>

        <form onSubmit={addBlog}>

        <div>
          title

          <input
            value={title}
            onChange={({ target }) =>
              setTitle(target.value)
            }
          />
        </div>

        <div>
          author

          <input
            value={author}
            onChange={({ target }) =>
              setAuthor(target.value)
            }
          />
        </div>

        <div>
          url

          <input
            value={url}
            onChange={({ target }) =>
              setUrl(target.value)
            }
          />
        </div>

        <button type="submit">
          create
        </button>

      </form>
      </Togglable>


      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}

    </div>
  )
}

export default App