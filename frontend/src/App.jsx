import React, { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminPage from './pages/AdminPage'
import Header from './components/Header'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const handleNavigate = (page, productId = null) => {
    setCurrentPage(page)
    if (productId) {
      setSelectedProductId(productId)
    }
  }

  return (
    <div className="app">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cart.length}
      />
      <main className="container">
        {currentPage === 'home' && (
          <HomePage onProductSelect={handleNavigate} onAddToCart={addToCart} />
        )}
        {currentPage === 'product' && (
          <ProductDetailsPage
            productId={selectedProductId}
            onAddToCart={addToCart}
            onBack={() => handleNavigate('home')}
          />
        )}
        {currentPage === 'cart' && (
          <CartPage
            cart={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
            onCheckout={() => handleNavigate('checkout')}
          />
        )}
        {currentPage === 'checkout' && (
          <CheckoutPage
            cart={cart}
            onOrderComplete={() => {
              clearCart()
              handleNavigate('home')
            }}
          />
        )}
        {currentPage === 'admin' && (
          <AdminPage onBack={() => handleNavigate('home')} />
        )}
      </main>
    </div>
  )
}

export default App
