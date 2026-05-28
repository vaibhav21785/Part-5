import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'

import BlogForm from './BlogForm'

test('form calls event handler with right details', async () => {

  const createBlog = vi.fn()

  const user = userEvent.setup()

  render(
    <BlogForm createBlog={createBlog} />
  )

  const inputs = screen.getAllByRole('textbox')

  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  const createButton = screen.getByText('create')

  await user.type(titleInput, 'React Patterns')
  await user.type(authorInput, 'Michael Chan')
  await user.type(urlInput, 'www.reactpatterns.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React Patterns',
    author: 'Michael Chan',
    url: 'www.reactpatterns.com',
  })
})