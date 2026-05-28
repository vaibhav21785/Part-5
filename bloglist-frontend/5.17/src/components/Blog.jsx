import { useState } from 'react'

const Blog = ({
  blog,
  updateLikes,
  removeBlog,
  user
}) => {

  // show/hide state
  const [visible, setVisible] = useState(false)

  // blog style
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // toggle details
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>

      {/* Always visible */}
      <div>
        {blog.title} {blog.author}

        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>


      {/* Visible only when button clicked */}
      {visible && (
        <div className="togglableContent">

          <div>
            {blog.url}
          </div>

          <div>
            {blog.likes} likes

            <button onClick={() => {
              console.log('like clicked')
              updateLikes(blog)
            }}>
              like
            </button>
          </div>

          <div>
            {blog.user?.name}
          </div>

        </div>
      )}

      {blog.user?.username === user.username && (
        <button onClick={() => removeBlog(blog)}>
          remove
        </button>
      )}
    </div>
  )
}

export default Blog