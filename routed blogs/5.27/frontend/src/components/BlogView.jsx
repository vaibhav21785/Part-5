const BlogView = ({ blog, user, updateBlog }) => {

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
          <button onClick={() => updateBlog(blog)}>
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

export default BlogView