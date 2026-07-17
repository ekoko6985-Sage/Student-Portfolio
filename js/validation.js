// Form Validation
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
}

function handleContactFormSubmit(e) {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const subscribe = document.getElementById('subscribe').checked;

    // Clear previous errors
    clearAllErrors();

    // Validate fields
    let isValid = true;

    if (!fullName) {
        showError('nameError', 'Full name is required');
        isValid = false;
    } else if (fullName.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }

    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (phone && !isValidPhone(phone)) {
        showError('phoneError', 'Phone number must contain only digits');
        isValid = false;
    }

    if (!subject) {
        showError('subjectError', 'Subject is required');
        isValid = false;
    }

    if (!message) {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }

    if (isValid) {
        // Simulate form submission
        submitForm(fullName, email, phone, subject, message, subscribe);
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function submitForm(fullName, email, phone, subject, message, subscribe) {
    // Here you would normally send the data to a server
    // For now, we'll just show a success message
    console.log('Form submitted:', {
        fullName,
        email,
        phone,
        subject,
        message,
        subscribe
    });

    // Store in localStorage for demonstration
    const formData = {
        fullName,
        email,
        phone,
        subject,
        message,
        subscribe,
        submittedAt: new Date().toISOString()
    };

    let submissions = JSON.parse(localStorage.getItem('contact_submissions')) || [];
    submissions.push(formData);
    localStorage.setItem('contact_submissions', JSON.stringify(submissions));

    // Show success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        contactForm.style.display = 'none';

        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'block';
            successMessage.style.display = 'none';
        }, 3000);
    }
}

// Real-time validation
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const value = emailInput.value.trim();
        if (value && !isValidEmail(value)) {
            showError('emailError', 'Please enter a valid email address');
        } else {
            document.getElementById('emailError').classList.remove('show');
        }
    });
}

if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
        const value = phoneInput.value.trim();
        if (value && !isValidPhone(value)) {
            showError('phoneError', 'Please enter a valid phone number');
        } else {
            document.getElementById('phoneError').classList.remove('show');
        }
    });
}

if (messageInput) {
    messageInput.addEventListener('input', () => {
        const value = messageInput.value.trim();
        if (value && value.length < 10) {
            document.getElementById('messageError').textContent = `${value.length}/10 minimum characters`;
            document.getElementById('messageError').classList.add('show');
        } else {
            document.getElementById('messageError').classList.remove('show');
        }
    });
}
