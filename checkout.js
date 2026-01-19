// Order tracking page functionality

// Load order details
function loadOrderDetails() {
    const orderData = JSON.parse(localStorage.getItem('currentOrder'));
    
    if (!orderData) {
        // Create sample order for demo
        const sampleOrder = {
            orderId: 'FE' + Date.now(),
            items: [
                { name: 'Margherita Pizza', price: 14.99, quantity: 2 },
                { name: 'Caesar Salad', price: 8.99, quantity: 1 },
                { name: 'Tiramisu', price: 6.99, quantity: 1 }
            ],
            deliveryAddress: {
                name: 'John Doe',
                phone: '+1 (555) 123-4567',
                address: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zip: '10001'
            },
            total: '$49.95'
        };
        
        displayOrderDetails(sampleOrder);
        return;
    }
    
    displayOrderDetails(orderData);
}

// Display order details
function displayOrderDetails(orderData) {
    // Set order ID
    document.getElementById('orderId').textContent = orderData.orderId;
    
    // Display order items
    const orderItemsList = document.getElementById('orderItemsList');
    let itemsHTML = '';
    let subtotal = 0;
    
    orderData.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div style="padding: 15px 0; border-bottom: 1px solid #f0f0f0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong>${item.name}</strong>
                    <strong style="color: var(--primary-color);">$${itemTotal.toFixed(2)}</strong>
                </div>
                <div style="font-size: 13px; color: #666;">
                    Quantity: ${item.quantity} × $${item.price.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    orderItemsList.innerHTML = itemsHTML;
    
    // Calculate totals
    const deliveryFee = subtotal > 25 ? 0 : 3.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    
    // Update summary
    document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summaryDelivery').textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
    
    // Display delivery address
    const address = orderData.deliveryAddress;
    document.getElementById('customerName').textContent = address.name;
    document.getElementById('customerPhone').textContent = address.phone;
    document.getElementById('customerAddress').textContent = 
        `${address.address}, ${address.city}, ${address.state} ${address.zip}`;
}

// Simulate real-time updates
function simulateOrderProgress() {
    // Update timestamps with realistic times
    const now = new Date();
    
    const time1 = new Date(now.getTime() - 15 * 60000); // 15 mins ago
    const time2 = new Date(now.getTime() - 10 * 60000); // 10 mins ago
    const time3 = new Date(now.getTime() - 5 * 60000);  // 5 mins ago
    
    document.getElementById('time1').textContent = formatTimeAgo(time1);
    document.getElementById('time2').textContent = formatTimeAgo(time2);
    document.getElementById('time3').textContent = formatTimeAgo(time3);
}

// Format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
}

// Animate driver marker
function animateDriver() {
    const driverMarker = document.querySelector('.map-marker.driver');
    if (!driverMarker) return;
    
    let progress = 0;
    setInterval(() => {
        progress += 0.5;
        if (progress > 100) progress = 0;
        
        // Move driver marker across the map
        const x = 50 - (progress / 2);
        const y = 50 - (progress / 2);
        driverMarker.style.left = `${50 + (x - 50) * 0.5}%`;
        driverMarker.style.top = `${50 + (y - 50) * 0.5}%`;
    }, 100);
}

// Handle help buttons
const helpButtons = document.querySelectorAll('.help-btn');
helpButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const btnText = btn.textContent.trim();
        
        if (btnText.includes('Support')) {
            alert('Contacting support... Our team will reach out to you shortly.');
        } else if (btnText.includes('Cancel')) {
            if (confirm('Are you sure you want to cancel this order?')) {
                alert('Your cancellation request has been submitted.');
            }
        } else if (btnText.includes('Issue')) {
            alert('Please describe your issue. Our team will investigate immediately.');
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadOrderDetails();
    simulateOrderProgress();
    animateDriver();
    
    // Update timestamps every minute
    setInterval(simulateOrderProgress, 60000);
});