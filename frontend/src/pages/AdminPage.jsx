import React, { useState, useEffect } from 'react'
import { getProducts, addProduct, deleteProduct } from '../services/api'

const AdminPage = ({ onBack }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await addProduct(formData)
      setSuccess('Product added successfully!')
      setFormData({ name: '', price: '', description: '', image: '' })
      await fetchProducts()
    } catch (err) {
      setError('Failed to add product')
      console.error(err)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        setSuccess('Product deleted successfully!')
        await fetchProducts()
      } catch (err) {
        setError('Failed to delete product')
        console.error(err)
      }
    }
  }

  if (loading) return <div className="loading">Loading admin panel...</div>

  return (
    <div className="admin-container">
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      <div className="admin-section">
        <h2>Add New Product</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleAddProduct} className="admin-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Product name"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="99.99"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Add Product
          </button>
        </form>
      </div>

      <div className="admin-section">
        <h2>Manage Products</h2>
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="admin-products">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.description.substring(0, 50)}...</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{ padding: '8px 15px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
