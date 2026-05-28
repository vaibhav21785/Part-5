import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {

  const blog = {
    title: 'React Testing',
    author: 'Vaibhav',
    url: 'www.test.com',
    likes: 10,
    user: {
      username: 'vaibhav',
      name: 'Vaibhav',
    },
  }

  const user = {
    username: 'vaibhav',
  }

  render(
    <Blog
      blog={blog}
      user={user}
    />
  )

  expect(
    screen.getByText('React Testing Vaibhav')
  ).toBeDefined()

  expect(
    screen.queryByText('www.test.com')
  ).toBeNull()

  expect(
    screen.queryByText('10 likes')
  ).toBeNull()
})