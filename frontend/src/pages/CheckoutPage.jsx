import React, { useState } from 'react'
import { createOrder } from '../services/api'

const CheckoutPage = ({ cart, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const orderData = {
        items: cart,
        totalPrice: totalPrice,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail
      }

      await createOrder(orderData)
      setSuccess(true)
      setTimeout(() => {
        onOrderComplete()
      }, 2000)
    } catch (err) {
      setError('Failed to place order. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="checkout-container">
        <div className="success-message" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>✓ Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-section">
        <h2>Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
        <div style={{ padding: '10px 0', fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="checkout-section">
          <h2>Billing Information</h2>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="checkout-section">
          <h2>Payment Method</h2>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            This is a demo checkout. No actual payment will be processed.
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="radio" name="payment" defaultChecked />
            Credit Card (Demo)
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Processing...' : 'Complete Order'}
        </button>
      </form>
    </div>
  )
}

export default CheckoutPage
