import React from 'react'

const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
        onClick={onViewDetails}
        style={{ cursor: 'pointer' }}
      />
      <div className="product-info">
        <h3 className="product-name" onClick={onViewDetails} style={{ cursor: 'pointer' }}>
          {product.name}
        </h3>
        <p className="product-description">
          {product.description.substring(0, 80)}...
        </p>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <div className="product-actions">
          <button className="btn btn-primary" onClick={onViewDetails}>
            View Details
          </button>
          <button className="btn btn-secondary" onClick={onAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
