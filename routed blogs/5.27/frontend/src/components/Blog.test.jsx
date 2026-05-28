import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, test, expect } from 'vitest'

import Blog from './Blog'

afterEach(() => {
  cleanup()
})

describe('<Blog />', () => {

  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com',
    likes: 7,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  test('unauthenticated users see only blog info and likes', () => {

    render(
      <Blog
        blog={blog}
        user={null}
      />
    )

    expect(
      screen.getAllByText(/React patterns/)[0]
    ).toBeDefined()

    expect(
      screen.queryByText('like')
    ).toBeNull()

    expect(
      screen.queryByText('remove')
    ).toBeNull()
  })

  test('non creator sees only like button', async () => {

    const userSetup = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={{
          username: 'anotheruser'
        }}
      />
    )

    const viewButton = screen.getByRole('button', {
      name: 'view'
    })

    await userSetup.click(viewButton)

    expect(
      screen.getByText('like')
    ).toBeDefined()

    expect(
      screen.queryByText('remove')
    ).toBeNull()
  })

  test('creator sees remove button', async () => {

    const userSetup = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={{
          username: 'testuser'
        }}
      />
    )

    const viewButton = screen.getByRole('button', {
      name: 'view'
    })

    await userSetup.click(viewButton)

    expect(
      screen.getByText('remove')
    ).toBeDefined()
  })
})