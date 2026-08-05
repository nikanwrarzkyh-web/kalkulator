let currentSection = 'home';
let scrollListenerAdded = false;

// Smooth scrolling function
function smoothScroll(target, duration = 800) {
  const targetElement = document.querySelector(target);
  if (!targetElement) return;

  const targetPosition = targetElement.offsetTop - 80;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = progress * progress * (2 - progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// Navigation click handler
function handleNavClick(e) {
  e.preventDefault();
  const target = e.target.closest('.nav-link');
  if (!target) return;

  // Update active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  target.classList.add('active');

  // Scroll to section
  const sectionId = target.getAttribute('href').substring(1);
  currentSection = sectionId;

  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block';

    // Add fade-in animation
    setTimeout(() => {
      targetSection.classList.add('fade-in');
      const elements = targetSection.querySelectorAll('.info-card, .skill-item, .timeline-item, .portfolio-card, .contact-item');
      elements.forEach((el, index) => {
        el.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        el.classList.add('fade-in');
      });
    }, 100);

    // Smooth scroll
    smoothScroll(`#${sectionId}`);
  }

  // Close mobile menu
  document.querySelector('.nav-links').classList.remove('active');
  document.querySelector('.hamburger i').className = 'fas fa-bars';
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger i');

  navLinks.classList.toggle('active');

  if (navLinks.classList.contains('active')) {
    hamburger.className = 'fas fa-times';
  } else {
    hamburger.className = 'fas fa-bars';
  }
}

// Navbar scroll effect
function handleScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  // Update active nav link
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Navbar scroll effect
  if (window.pageYOffset > 50) {
    navbar.style.padding = '0.5rem 0';
    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
  } else {
    navbar.style.padding = '1rem 0';
    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
  }
}

// Form submission
function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const data = Object.fromEntries(formData);

  console.log('Form submitted:', data);

  alert('Terima kasih atas pesan Anda! Saya akan segera menghubungi Anda.');
  form.reset();
}

// Initialize animations
function initializeAnimations() {
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${0.1 + (index * 0.1)}s`;
    section.classList.add('fade-in');
  });

  const elements = document.querySelectorAll('.info-card, .skill-item, .timeline-item, .portfolio-card, .contact-item, .stat-item');
  elements.forEach((el, index) => {
    el.style.animationDelay = `${0.2 + (index * 0.05)}s`;
    el.classList.add('fade-in');
  });
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(e) {
  const hash = window.location.hash.substring(1) || 'home';
  currentSection = hash;

  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });

  const targetSection = document.getElementById(hash);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block';

    smoothScroll(`#${hash}`);

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    const activeNavLink = document.querySelector(`.nav-link[href="#${hash}"]`);
    if (activeNavLink) {
      activeNavLink.classList.add('active');
    }
  }
});

// Main initialization
function init() {
  // Add event listeners
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  document.querySelector('.hamburger').addEventListener('click', toggleMobileMenu);

  // Add scroll listener
  let lastScrollTop = 0;
  let scrollTimeout;

  function handleScrollThrottle() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(scrollTop - lastScrollTop) > 50) {
      handleScroll();
      lastScrollTop = scrollTop;
    }
  }

  window.addEventListener('scroll', function() {
    if (!scrollListenerAdded) {
      window.addEventListener('scroll', handleScrollThrottle);
      scrollListenerAdded = true;
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 100);
  });

  // Initialize animations
  initializeAnimations();

  // Handle initial hash
  const initialHash = window.location.hash.substring(1) || 'home';
  currentSection = initialHash;

  // Show initial section
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });

  const initialSection = document.getElementById(initialHash);
  if (initialSection) {
    initialSection.classList.add('active');
    initialSection.style.display = 'block';
  }

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${initialHash}`) {
      link.classList.add('active');
    }
  });

  // Add smooth scrolling to all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        smoothScroll(this.getAttribute('href'));
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    const nav = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');

    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      document.querySelector('.nav-links').classList.remove('active');
      document.querySelector('.hamburger i').className = 'fas fa-bars';
    }
  });

  // Add hover effects for portfolio cards
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Add hover effects for skill items
  document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });

    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Add ripple effect to buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add CSS for ripple effect
  const style = document.createElement('style');
  style.textContent = `
    .btn {
      position: relative;
      overflow: hidden;
    }

    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Add reveal animations on scroll
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');

  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);

// Initialize everything when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle resize events
window.addEventListener('resize', function() {
  // Close mobile menu on resize
  if (window.innerWidth > 768) {
    document.querySelector('.nav-links').classList.remove('active');
    document.querySelector('.hamburger i').className = 'fas fa-bars';
  }
});