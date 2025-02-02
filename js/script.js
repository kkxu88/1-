// Product data
const products = [
    {
        id: 1,
        name: 'Elegant Dress',
        price: 299,
        image: 'https://via.placeholder.com/300x200?text=Dress'
    },
    {
        id: 2,
        name: 'Casual Jeans',
        price: 199,
        image: 'https://via.placeholder.com/300x200?text=Jeans'
    },
    {
        id: 3,
        name: 'Classic T-Shirt',
        price: 99,
        image: 'https://via.placeholder.com/300x200?text=T-Shirt'
    },
    {
        id: 4,
        name: 'Spring Jacket',
        price: 399,
        image: 'https://via.placeholder.com/300x200?text=Jacket'
    }
];

// Shopping cart data
let cart = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
});

// Display products
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        alert('Product added to cart!');
    }
}

// Update cart count display
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cart modal functionality
const modal = document.getElementById('cartModal');
const cartIcon = document.querySelector('.cart');
const closeBtn = document.querySelector('.close');

cartIcon.onclick = function() {
    updateCartDisplay();
    modal.style.display = "block";
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    let total = 0;
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>
                <span class="remove-item" onclick="removeFromCart(${index})">✕</span>
            </div>
        `;
    });
    
    cartTotal.textContent = total;
    
    // Initialize PayPal buttons
    initPayPalButton(total);
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
}

// Initialize PayPal button
function initPayPalButton(total) {
    if (document.querySelector('#paypal-button-container').children.length > 0) {
        document.querySelector('#paypal-button-container').innerHTML = '';
    }
    
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color:  'blue',
            shape:  'rect',
            label:  'paypal'
        },
        
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total
                    }
                }]
            });
        },
        
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                // Clear cart after successful payment
                cart = [];
                updateCartCount();
                modal.style.display = "none";
            });
        },
        
        onError: function(err) {
            console.log(err);
            alert('There was an error processing your payment');
        }
    }).render('#paypal-button-container');
} 