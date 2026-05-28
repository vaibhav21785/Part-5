import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('shows url and likes when view button is clicked', async () => {

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

  const button = screen.getByText('view')

  const userEventSetup = userEvent.setup()

  await userEventSetup.click(button)

  expect(
    screen.getByText('www.test.com')
  ).toBeDefined()

  expect(
    screen.getByText('10 likes')
  ).toBeDefined()
})