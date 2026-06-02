import React from 'react'

const CartPage = ({ cart, onRemove, onUpdateQuantity, onCheckout }) => {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div>
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">${item.price.toFixed(2)} each</div>
            </div>
            <div className="cart-item-controls">
              <div className="quantity-control">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                  −
                </button>
                <span style={{ minWidth: '40px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <div style={{ minWidth: '120px', textAlign: 'right', fontWeight: 'bold' }}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                className="btn btn-danger"
                onClick={() => onRemove(item.id)}
                style={{ padding: '8px 15px' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <button
        className="btn btn-primary"
        onClick={onCheckout}
        style={{ width: '100%', padding: '15px', marginTop: '20px', fontSize: '16px' }}
      >
        Proceed to Checkout
      </button>
    </div>
  )
}

export default CartPage
