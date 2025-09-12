// DOM Elements
const body = document.body;
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const faqItems = document.querySelectorAll('.faq-item');
const bookingForm = document.getElementById('bookingForm');

// Navigation links handling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // If it's a section link (starts with #), handle smooth scrolling
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
        // If it's a page link, let it navigate normally (no preventDefault)
    });
});

// Hamburger Menu Toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Only close menu if it's a section link (same page)
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
            // For page links, let the page navigation handle closing the menu
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// FAQ Accordion
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// FAQ Category Toggle
const faqCategories = document.querySelectorAll('.faq-category');

faqCategories.forEach(category => {
    const categoryHeader = category.querySelector('.faq-category-header');
    
    categoryHeader.addEventListener('click', () => {
        const isCollapsed = category.classList.contains('collapsed');
        
        // Toggle the collapsed state
        if (isCollapsed) {
            category.classList.remove('collapsed');
        } else {
            category.classList.add('collapsed');
        }
    });
});

// Logo click to top functionality
const logoLink = document.querySelector('.logo-link');
if (logoLink) {
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.section-header, .about-feature, .menu-category, .package-card, .process-step, .gallery-item, .review-card');
animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Form Handling (EmailJS)
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Initialize EmailJS using data attribute (you will paste your key)
        const serviceId = bookingForm.getAttribute('data-emailjs-service');
        const templateId = bookingForm.getAttribute('data-emailjs-template');
        const publicKey = bookingForm.getAttribute('data-emailjs-public');
        
        if (!emailjs || !publicKey || !serviceId || !templateId) {
            console.error('EmailJS not configured');
            showNotification('Form is not configured. Please try again later.', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        emailjs.init(publicKey);
        
        // Collect form data
        const formData = new FormData(bookingForm);
        const dietaryRequirements = formData.getAll('dietary');
        const data = Object.fromEntries(formData.entries());
        if (dietaryRequirements.length > 0) {
            data.dietary = dietaryRequirements.join(', ');
        }
        
        // Map hyphenated form fields to EmailJS-friendly keys
        data.event_date = formData.get('event-date') || '';
        data.event_type = formData.get('event-type') || '';
        
        // Normalize marketing opt-in
        data.marketing = formData.get('marketing') ? 'Yes' : 'No';
        
        // Add timestamp (UK timezone)
        try {
            data.time = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
        } catch (_) {
            data.time = new Date().toISOString();
        }
        
        try {
            await emailjs.send(serviceId, templateId, data);
            showNotification('Thank you! We\'ll respond within 2 hours during business hours.', 'success');
            bookingForm.reset();
        } catch (error) {
            console.error('EmailJS submission error:', error);
            const details = (error && (error.text || error.message)) ? ` (${error.text || error.message})` : '';
            showNotification(`Sorry, there was an error sending your request${details}. Please try again or email info@grillseekers.co.uk`, 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        ${type === 'success' ? 'background: #28a745; color: white;' : ''}
        ${type === 'error' ? 'background: #dc3545; color: white;' : ''}
        ${type === 'info' ? 'background: white; color: #333; border: 1px solid #ddd;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Gallery Modal (if needed in future)
function openGalleryModal(imageSrc, title, description) {
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
                <img src="${imageSrc}" alt="${title}">
                <div class="modal-info">
                    <h4>${title}</h4>
                    <p>${description}</p>
                </div>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
}

// Add CSS for notifications and modals
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .gallery-modal .modal-overlay {
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    
    .gallery-modal .modal-content {
        max-width: 90vw;
        max-height: 90vh;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
    }
    
    .gallery-modal .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 10;
    }
    
    .gallery-modal img {
        width: 100%;
        height: auto;
        display: block;
    }
    
    .gallery-modal .modal-info {
        padding: 1.5rem;
    }
    
    .gallery-modal .modal-info h4 {
        margin-bottom: 0.5rem;
        color: var(--primary-color);
    }
`;

document.head.appendChild(additionalStyles);

// Set current year in footer
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
    yearElement.textContent = yearElement.textContent.replace('2024', currentYear);
}

// Enhanced scroll animations with stagger effect
function addStaggerAnimation() {
    const staggerGroups = {
        '.hero-features .feature': 100,
        '.about-features .about-feature': 150,
        '.menu-items .menu-item': 100,
        '.packages-grid .package-card': 200,
        '.process-steps .process-step': 150,
        '.gallery-grid .gallery-item': 100,
        '.reviews-grid .review-card': 200
    };
    
    Object.entries(staggerGroups).forEach(([selector, delay]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * delay}ms`;
            body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Initialize stagger animations
document.addEventListener('DOMContentLoaded', addStaggerAnimation);

// Performance optimization: Lazy load images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Preload critical images
const criticalImages = [
    'https://images.pexels.com/photos/1058455/pexels-photo-1058455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/2491273/pexels-photo-2491273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
];

criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

// Enhanced form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        const fieldGroup = field.closest('.form-group');
        
        // Remove existing error states
        fieldGroup.classList.remove('error');
        const existingError = fieldGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate field
        if (!value) {
            isValid = false;
            fieldGroup.classList.add('error');
            showFieldError(fieldGroup, 'This field is required');
        } else if (field.type === 'email' && !isValidEmail(value)) {
            isValid = false;
            fieldGroup.classList.add('error');
            showFieldError(fieldGroup, 'Please enter a valid email address');
        } else if (field.type === 'tel' && !isValidPhone(value)) {
            isValid = false;
            fieldGroup.classList.add('error');
            showFieldError(fieldGroup, 'Please enter a valid phone number');
        }
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    return isValid;
}

function showFieldError(fieldGroup, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    fieldGroup.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Add error styles
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: var(--error);
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
`;
document.head.appendChild(errorStyles);