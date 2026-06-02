import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Products
export const getProducts = async () => {
  try {
    const response = await api.get('/products')
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export const addProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData)
    return response.data
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Orders
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData)
    return response.data
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export const getOrders = async () => {
  try {
    const response = await api.get('/orders')
    return response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export default api
