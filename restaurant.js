// Restaurant menu page specific functionality

// Add to cart buttons
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click event
        
        const itemName = btn.getAttribute('data-item');
        const itemPrice = btn.getAttribute('data-price');
        
        // Add item to cart
        addToCart(itemName, itemPrice);
        
        // Visual feedback
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    });
});

// Menu category navigation
const categoryLinks = document.querySelectorAll('.category-link');

categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        categoryLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get target category
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Scroll to category with offset for fixed header
            const offset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active category on scroll
const menuCategories = document.querySelectorAll('.menu-category');

window.addEventListener('scroll', () => {
    let current = '';
    
    menuCategories.forEach(category => {
        const categoryTop = category.offsetTop;
        const categoryHeight = category.clientHeight;
        
        if (window.pageYOffset >= categoryTop - 150) {
            current = category.getAttribute('id');
        }
    });
    
    categoryLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Menu item click - show details (optional enhancement)
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Don't trigger if clicking the add button
        if (e.target.closest('.add-to-cart-btn')) {
            return;
        }
        
        // Could open a modal with more details here
        // For now, we'll just add a subtle animation
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 100);
    });
});