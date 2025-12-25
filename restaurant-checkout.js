// Display order summary on checkout page
function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('order-subtotal');
    const totalElement = document.getElementById('order-total');
    
    if (!orderItemsContainer) return;
    
    // Redirect to cart if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'restaurant-menu.html';
        return;
    }
    
    // Clear container
    orderItemsContainer.innerHTML = '';
    
    // Display each item
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <div class="order-item-details">
                <strong>${item.name}</strong>
                <span>x${item.quantity}</span>
            </div>
            <div class="order-item-price">
                $${(item.price * item.quantity).toLocaleString()} JMD
            </div>
        `;
        orderItemsContainer.appendChild(itemDiv);
    });
    
    // Calculate and display totals
    const subtotal = calculateTotal();
    const deliveryFee = 300;
    const total = subtotal + deliveryFee;
    
    subtotalElement.textContent = `$${subtotal.toLocaleString()} JMD`;
    totalElement.textContent = `$${total.toLocaleString()} JMD`;
}

// Create WhatsApp message from order data
function createWhatsAppMessage(orderData) {
    let message = `🍽️ *NEW ORDER from Mr. Breakfast*\n\n`;
    message += `📋 *Order Details:*\n`;
    
    // Add items
    orderData.items.forEach(item => {
        message += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString()} JMD\n`;
    });
    
    message += `\n💰 *Payment Summary:*\n`;
    message += `Subtotal: $${orderData.subtotal.toLocaleString()} JMD\n`;
    message += `Delivery: $${orderData.deliveryFee} JMD\n`;
    message += `*Total: $${orderData.total.toLocaleString()} JMD*\n`;
    
    message += `\n👤 *Customer Information:*\n`;
    message += `Name: ${orderData.firstName} ${orderData.lastName}\n`;
    message += `Phone: ${orderData.phone}\n`;
    if (orderData.email) {
        message += `Email: ${orderData.email}\n`;
    }
    
    message += `\n📍 *Delivery Address:*\n`;
    message += `${orderData.address}\n`;
    message += `${orderData.city}, ${orderData.parish}\n`;
    
    if (orderData.notes) {
        message += `\n📝 *Special Instructions:*\n${orderData.notes}\n`;
    }
    
    message += `\n💳 *Payment Method:* ${getPaymentMethodName(orderData.payment)}\n`;
    message += `\n🕐 *Order Time:* ${orderData.orderDate}`;
    
    return encodeURIComponent(message);
}

// Get payment method display name
function getPaymentMethodName(method) {
    const methods = {
        'cash': 'Cash on Delivery',
        'card': 'Card on Delivery',
        'online': 'Online Payment'
    };
    return methods[method] || method;
}

// Handle form submission
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        parish: document.getElementById('parish').value,
        city: document.getElementById('city').value,
        notes: document.getElementById('notes').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        items: cart,
        subtotal: calculateTotal(),
        deliveryFee: 300,
        total: calculateTotal() + 300,
        orderDate: new Date().toLocaleString()
    };
    
    // Generate order number
    const orderNumber = 'ORD-' + Date.now();
    formData.orderNumber = orderNumber;
    
    // Store order in localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(formData);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('lastOrder', JSON.stringify(formData));
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(formData);
    
    // YOUR WHATSAPP NUMBER - CHANGE THIS!
    // Format: Country code + number (no spaces, dashes, or +)
    // Example for Jamaica: 876XXXXXXX
    const yourWhatsAppNumber = '8767890624'; // REPLACE WITH YOUR ACTUAL NUMBER
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${yourWhatsAppNumber}?text=${whatsappMessage}`;
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Redirect to confirmation page after a short delay
    setTimeout(() => {
        window.location.href = 'restaurant-confirmation.html';
    }, 1000);
});

// Initialize on page load
displayOrderSummary();