// Cart functionality
let cart = JSON.parse(localStorage.getItem('foodExpressCart')) || [];

// Initialize cart
function initCart() {
    updateCartUI();
    updateCartCount();
}

// Cart sidebar toggle
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');

if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (cartSidebar && cartSidebar.classList.contains('active')) {
        if (!cartSidebar.contains(e.target) && e.target !== cartBtn && !cartBtn.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    }
});

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Update cart UI
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }

    let cartHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
            <div class="cart-item" style="padding: 15px 0; border-bottom: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 16px; margin-bottom: 8px;">${item.name}</h4>
                        <div style="color: #FF6B35; font-weight: 700; font-size: 16px;">$${item.price.toFixed(2)}</div>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #ff4444; cursor: pointer; font-size: 20px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div style="display: flex; align-items: center; gap: 15px; margin-top: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; background: #f8f9fa; border-radius: 20px; padding: 5px 10px;">
                        <button onclick="decreaseQuantity(${index})" style="background: none; border: none; color: #666; cursor: pointer; font-size: 18px; width: 30px; height: 30px;">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})" style="background: none; border: none; color: #666; cursor: pointer; font-size: 18px; width: 30px; height: 30px;">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div style="color: #666;">Subtotal: <strong style="color: #1a1a1a;">$${itemTotal.toFixed(2)}</strong></div>
                </div>
            </div>
        `;
    });

    cartItems.innerHTML = cartHTML;
    
    if (cartFooter) {
        cartFooter.style.display = 'block';
        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }
}

// Add to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    updateCartCount();
    showNotification(`${name} added to cart!`);
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    updateCartCount();
}

// Increase quantity
function increaseQuantity(index) {
    cart[index].quantity++;
    saveCart();
    updateCartUI();
    updateCartCount();
}

// Decrease quantity
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeFromCart(index);
        return;
    }
    saveCart();
    updateCartUI();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('foodExpressCart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Filter restaurants (for homepage)
const filterTabs = document.querySelectorAll('.filter-tab');
const restaurantCards = document.querySelectorAll('.restaurant-card');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Get filter value
        const filter = tab.getAttribute('data-filter');
        
        // Filter restaurants
        restaurantCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const locationInput = document.getElementById('locationInput');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (restaurantCards.length > 0) {
            restaurantCards.forEach(card => {
                const restaurantName = card.querySelector('h3').textContent.toLowerCase();
                const cuisine = card.querySelector('.restaurant-cuisine').textContent.toLowerCase();
                
                if (restaurantName.includes(searchTerm) || cuisine.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    });
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    initCart();
});

// Restaurant card click - navigate to restaurant page
restaurantCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't navigate if clicking on a button or link
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
            window.location.href = 'restaurant.html';
        }
    });
});

// Category card click
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        window.location.href = 'index.html#restaurants';
    });
});