import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/api'

const HomePage = ({ onProductSelect, onAddToCart }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <div className="loading">Loading products...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div>
      <h1>Featured Products</h1>
      {products.length === 0 ? (
        <div className="error-message">No products available</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={() => onProductSelect('product', product.id)}
              onAddToCart={() => onAddToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
