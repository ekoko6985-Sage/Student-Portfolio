// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('backToTop');
const scrollProgress = document.getElementById('scrollProgress');
const preloader = document.getElementById('preloader');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializePreloader();
    initializeNavigation();
    initializeScrollProgress();
    initializeBackToTop();
    initializeScrollAnimations();
    initializeCounters();
    initializeFAQ();
    initializeModals();
});

// Preloader
function initializePreloader() {
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.style.animation = 'fadeOut 0.5s ease-in-out forwards';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
}

// Navigation
function initializeNavigation() {
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar sticky shadow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        }
    });
}

// Scroll Progress Bar
function initializeScrollProgress() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });
}

// Back to Top Button
function initializeBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Animated Counters
function initializeCounters() {
    const counterElements = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.parentElement.parentElement.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counterElements.forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Project Filtering
function initializeProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter projects
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// FAQ Accordion
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isOpen = faqItem.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isOpen) {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// Project Modal
function initializeModals() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeProjectModal);
    }

    // Close modal when clicking outside
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
    }
}

function openProjectModal(index) {
    const modal = document.getElementById('projectModal');
    const projectData = [
        {
            title: 'Student Portfolio Website',
            description: 'A modern, responsive portfolio website built with HTML5, CSS3, and Vanilla JavaScript. This project showcases modern web development practices including glassmorphism effects, smooth animations, and a fully functional academic planner with local storage support. The site is fully responsive and works seamlessly across desktop, tablet, and mobile devices.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Local Storage'],
            image: 'images/project1.jpg'
        },
        {
            title: 'Network Security Analysis',
            description: 'Comprehensive analysis and documentation of network security protocols. This project covers TCP/IP security, firewall configurations, VPN implementations, and vulnerability assessment methodologies. It includes detailed technical documentation and practical recommendations for securing organizational networks.',
            tech: ['Network Security', 'TCP/IP', 'Firewalls', 'VPN', 'Documentation'],
            image: 'images/project2.jpg'
        },
        {
            title: 'Cybersecurity Awareness Campaign',
            description: 'Educational materials and awareness campaign on best practices for information security. Covers data protection, password management, phishing prevention, safe internet usage, and organizational security policies. Designed to educate and raise awareness about cybersecurity among various audiences.',
            tech: ['Security Education', 'Awareness', 'Documentation', 'Training Materials'],
            image: 'images/project3.jpg'
        },
        {
            title: 'Academic Task Manager',
            description: 'Interactive task management application with full CRUD functionality. Features include creating, editing, and deleting tasks, marking completion status, priority levels, filtering options, and local storage persistence for data retention. Built with vanilla JavaScript for maximum compatibility.',
            tech: ['JavaScript', 'Local Storage', 'DOM API', 'Vanilla JS', 'User Interface'],
            image: 'images/project1.jpg'
        },
        {
            title: 'Ethical Hacking & Penetration Testing Guide',
            description: 'Comprehensive guide covering ethical hacking principles, penetration testing methodologies, vulnerability scanning techniques, exploitation methods, and security best practices for authorized assessments. Includes case studies and practical examples.',
            tech: ['Ethical Hacking', 'Pen Testing', 'Security', 'Testing Methodology'],
            image: 'images/project2.jpg'
        },
        {
            title: 'Digital Forensics & Incident Response',
            description: 'Study materials on digital forensics principles including evidence collection, analysis methodologies, incident response procedures, and case studies in cybersecurity investigations. Provides practical knowledge for investigating security incidents.',
            tech: ['Forensics', 'Incident Response', 'Analysis', 'Evidence Handling'],
            image: 'images/project3.jpg'
        }
    ];

    if (projectData[index]) {
        document.getElementById('modalImage').src = projectData[index].image;
        document.getElementById('modalTitle').textContent = projectData[index].title;
        document.getElementById('modalDescription').textContent = projectData[index].description;

        const techContainer = document.getElementById('modalTech');
        techContainer.innerHTML = '';
        projectData[index].tech.forEach(tech => {
            const badge = document.createElement('span');
            badge.className = 'tech-badge';
            badge.textContent = tech;
            techContainer.appendChild(badge);
        });

        modal.classList.add('show');
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
}

// Initialize project filtering on projects page
if (document.querySelector('.filter-btn')) {
    initializeProjectFiltering();
}

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});