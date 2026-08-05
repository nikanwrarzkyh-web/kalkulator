let currentSection = 'home';
let scrollListenerAdded = false;

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

function toggleMobileMenu(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger i');

  navLinks.classList.toggle('active');

  if (navLinks.classList.contains('active')) {
    hamburger.className = 'fas fa-times';
  } else {
    hamburger.className = 'fas fa-bars';
  }
}

function handleOutsideClick(e) {
  const nav = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks || !nav) return;

  if (hamburger.contains(e.target) || navLinks.contains(e.target)) {
    return;
  }

  if (!nav.contains(e.target)) {
    navLinks.classList.remove('active');
    const hamburgerIcon = document.querySelector('.hamburger i');
    if (hamburgerIcon) hamburgerIcon.className = 'fas fa-bars';
  }
}

function handleNavClick(e) {
  e.preventDefault();
  const target = e.target.closest('.nav-link');
  if (!target) return;

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  target.classList.add('active');

  const sectionId = target.getAttribute('href').substring(1);
  currentSection = sectionId;

  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block';

    setTimeout(() => {
      targetSection.classList.add('fade-in');
      const elements = targetSection.querySelectorAll('.info-card, .skill-item, .timeline-item, .portfolio-card, .contact-item, .stat-item');
      elements.forEach((el, index) => {
        el.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        el.classList.add('fade-in');
      });
    }, 100);

    smoothScroll(`#${sectionId}`);
  }

  const navLinks = document.querySelector('.nav-links');
  const hamburgerIcon = document.querySelector('.hamburger i');
  if (navLinks) navLinks.classList.remove('active');
  if (hamburgerIcon) hamburgerIcon.className = 'fas fa-bars';
}

function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  console.log('Form submitted:', data);

  alert('Terima kasih atas pesan Anda! Saya akan segera menghubungi Anda.');
  form.reset();
}

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

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  if (window.pageYOffset > 50) {
    navbar.style.padding = '0.5rem 0';
    navbar.style.background = 'rgba(248, 250, 252, 0.98)';
  } else {
    navbar.style.padding = '1rem 0';
    navbar.style.background = 'rgba(255, 255, 255, 0.9)';
  }
}

function init() {
  document.querySelector('.hamburger').addEventListener('click', toggleMobileMenu);
  document.querySelector('.hamburger').addEventListener('touchend', function(e) {
    e.preventDefault();
    toggleMobileMenu(e);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavClick);
  });

  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('touchend', handleOutsideClick);

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

  initializeAnimations();

  const initialHash = window.location.hash.substring(1) || 'home';
  currentSection = initialHash;

  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });

  const initialSection = document.getElementById(initialHash);
  if (initialSection) {
    initialSection.classList.add('active');
    initialSection.style.display = 'block';
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${initialHash}`) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const sectionId = href.substring(1);

        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        const activeNavLink = document.querySelector(`.nav-link[href="${href}"]`);
        if (activeNavLink) {
          activeNavLink.classList.add('active');
        }
        currentSection = sectionId;

        document.querySelectorAll('.section').forEach(section => {
          section.classList.remove('active');
          section.style.display = 'none';
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          targetSection.classList.add('active');
          targetSection.style.display = 'block';

          setTimeout(() => {
            targetSection.classList.add('fade-in');
            const elements = targetSection.querySelectorAll('.info-card, .skill-item, .timeline-item, .portfolio-card, .contact-item, .stat-item');
            elements.forEach((el, index) => {
              el.style.animationDelay = `${0.1 + (index * 0.1)}s`;
              el.classList.add('fade-in');
            });
          }, 100);

          smoothScroll(href);
        }

        const navLinks = document.querySelector('.nav-links');
        const hamburgerIcon = document.querySelector('.hamburger i');
        if (navLinks) navLinks.classList.remove('active');
        if (hamburgerIcon) hamburgerIcon.className = 'fas fa-bars';
      }
    });
  });

  const ctaButtons = document.querySelectorAll('.btn');
  ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  const portfolioCards = document.querySelectorAll('.portfolio-card');
  portfolioCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });

    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      const navLinks = document.querySelector('.nav-links');
      const hamburgerIcon = document.querySelector('.hamburger i');
      if (navLinks) navLinks.classList.remove('active');
      if (hamburgerIcon) hamburgerIcon.className = 'fas fa-bars';
    }
  });
}

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}