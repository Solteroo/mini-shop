import React, { useState, useEffect } from 'react'
import { getProduct } from '../services/api'

const ProductDetailsPage = ({ productId, onAddToCart, onBack }) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await getProduct(productId)
      setProduct(data)
      setError(null)
    } catch (err) {
      setError('Failed to load product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product)
    }
    alert('Added to cart!')
    onBack()
  }

  if (loading) return <div className="loading">Loading product details...</div>
  if (error) return <div className="error-message">{error}</div>
  if (!product) return <div className="error-message">Product not found</div>

  return (
    <div>
      <button className="btn btn-secondary" onClick={onBack}>
        ← Back to Products
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', borderRadius: '10px' }}
          />
        </div>
        <div>
          <h1>{product.name}</h1>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginTop: '10px' }}>
            ${product.price.toFixed(2)}
          </p>
          <p style={{ fontSize: '16px', color: '#666', marginTop: '20px', lineHeight: '1.6' }}>
            {product.description}
          </p>
          <div style={{ marginTop: '30px' }}>
            <div className="form-group">
              <label>Quantity:</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '50px' }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  style={{ width: '80px', textAlign: 'center' }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '50px' }}
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              style={{ marginTop: '20px', width: '100%', padding: '15px' }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
