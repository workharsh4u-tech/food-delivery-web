// Checkout page functionality

let discountAmount = 0;
let promoApplied = false;

// Valid promo codes
const promoCodes = {
    'SAVE20': 0.20,
    'FIRST50': 0.50,
    'WELCOME15': 0.15
};

// Calculate order summary
function calculateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('foodExpressCart')) || [];
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const deliveryFee = subtotal > 25 ? 0 : 3.99;
    const discount = promoApplied ? subtotal * discountAmount : 0;
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.08;
    const total = subtotal + deliveryFee - discount + tax;

    // Update UI
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    if (promoApplied) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
}

// Display order items
function displayOrderItems() {
    const cart = JSON.parse(localStorage.getItem('foodExpressCart')) || [];
    const orderItemsDiv = document.getElementById('orderItems');

    if (cart.length === 0) {
        orderItemsDiv.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Your cart is empty</p>';
        return;
    }

    let itemsHTML = '<div style="margin-bottom: 20px;">';
    cart.forEach(item => {
        itemsHTML += `
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                <div>
                    <strong>${item.name}</strong>
                    <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">Qty: ${item.quantity}</p>
                </div>
                <strong style="color: var(--primary-color);">$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        `;
    });
    itemsHTML += '</div>';

    orderItemsDiv.innerHTML = itemsHTML;
}

// Apply promo code
function applyPromo() {
    const promoInput = document.getElementById('promoCode');
    const promoCode = promoInput.value.toUpperCase().trim();
    const promoMessage = document.getElementById('promoMessage');

    if (!promoCode) {
        promoMessage.innerHTML = '<p style="color: #ff4444; font-size: 14px;">Please enter a promo code</p>';
        return;
    }

    if (promoCodes[promoCode]) {
        discountAmount = promoCodes[promoCode];
        promoApplied = true;
        promoMessage.innerHTML = `<p style="color: #4CAF50; font-size: 14px;"><i class="fas fa-check"></i> Promo code applied! You saved ${(discountAmount * 100).toFixed(0)}%</p>`;
        promoInput.disabled = true;
        calculateOrderSummary();
    } else {
        promoMessage.innerHTML = '<p style="color: #ff4444; font-size: 14px;"><i class="fas fa-times"></i> Invalid promo code</p>';
        promoApplied = false;
        discountAmount = 0;
        calculateOrderSummary();
    }
}

// Delivery time toggle
const deliveryTimeRadios = document.querySelectorAll('input[name="deliveryTime"]');
const scheduledTimeDiv = document.getElementById('scheduledTime');

deliveryTimeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'scheduled') {
            scheduledTimeDiv.style.display = 'block';
        } else {
            scheduledTimeDiv.style.display = 'none';
        }
    });
});

// Payment method toggle
const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
const cardDetailsDiv = document.getElementById('cardDetails');

paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'card') {
            cardDetailsDiv.style.display = 'block';
        } else {
            cardDetailsDiv.style.display = 'none';
        }
    });
});

// Card number formatting
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
}

// Expiry date formatting
const expiryInput = document.getElementById('expiry');
if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
}

// CVV validation
const cvvInput = document.getElementById('cvv');
if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
}

// Place order
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('foodExpressCart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Validate form
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Validate card details if card payment selected
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardNumber || !expiry || !cvv) {
            alert('Please fill in all card details');
            return;
        }
    }

    // Generate order ID
    const orderId = 'FE' + Date.now();

    // Store order details
    const orderData = {
        orderId: orderId,
        items: cart,
        timestamp: new Date().toISOString(),
        total: document.getElementById('total').textContent,
        deliveryAddress: {
            name: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value
        },
        paymentMethod: paymentMethod
    };

    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    
    // Clear cart
    localStorage.removeItem('foodExpressCart');

    // Show success message
    alert('Order placed successfully! Order ID: ' + orderId);

    // Redirect to tracking page
    window.location.href = 'tracking.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayOrderItems();
    calculateOrderSummary();
});