import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null


// Set token
const setToken = newToken => {
  token = `Bearer ${newToken}`
}


// Get all blogs
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}


// Create blog
const create = async newObject => {

  const config = {
    headers: {
      Authorization: token,
    },
  }

  const response = await axios.post(
    baseUrl,
    newObject,
    config
  )

  return response.data
}


// Update blog
const update = async (id, newObject) => {

  const response = await axios.put(
    `${baseUrl}/${id}`,
    newObject
  )

  return response.data
}


// Delete blog
const remove = async (id) => {

  const config = {
    headers: {
      Authorization: token,
    },
  }

  const response = await axios.delete(
    `${baseUrl}/${id}`,
    config
  )

  return response.data
}


export default {
  getAll,
  create,
  update,
  remove,
  setToken,
}