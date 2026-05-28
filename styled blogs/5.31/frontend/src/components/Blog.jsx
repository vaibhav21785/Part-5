import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }

  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  return (
    <div
      data-testid="blog"
      style={{
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
      }}
    >

      <div style={hideWhenVisible}>
        {blog.title} {blog.author}

        <button onClick={() => setVisible(true)}>
          view
        </button>
      </div>

      <div style={showWhenVisible}>

        <div>
          {blog.title} {blog.author}

          <button onClick={() => setVisible(false)}>
            hide
          </button>
        </div>

        <div>
          {blog.url}
        </div>

        <div>
          likes {blog.likes}

          {user && (
            <button onClick={() => updateBlog(blog)}>
              like
            </button>
          )}
        </div>

        <div>
          {blog.user?.name}
        </div>

        {user && user.username === blog.user?.username && (
          <button onClick={() => removeBlog(blog)}>
            remove
          </button>
        )}

      </div>
    </div>
  )
}

export default Blog