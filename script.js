// ===== TEAM RAINERI - Scripts =====

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

// ===== WAIVER SCROLL-TO-UNLOCK =====
const waiverScroll = document.getElementById('waiverScroll');
const waiverAgree = document.getElementById('waiverAgree');
const waiverHint = document.getElementById('waiverHint');
const submitBtn = document.getElementById('submitBtn');

let waiverScrolledToBottom = false;

waiverScroll.addEventListener('scroll', () => {
  if (waiverScrolledToBottom) return;
  
  const { scrollTop, scrollHeight, clientHeight } = waiverScroll;
  // Consider "scrolled to bottom" when within 30px of the end
  if (scrollTop + clientHeight >= scrollHeight - 30) {
    waiverScrolledToBottom = true;
    waiverAgree.disabled = false;
    waiverHint.classList.add('hidden');
  }
});

// Enable submit only when waiver is checked
waiverAgree.addEventListener('change', () => {
  submitBtn.disabled = !waiverAgree.checked;
});

// ===== CONTACT FORM HANDLER =====
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  // Validate age (must be 21+)
  const dob = new Date(form.dob.value);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  if (age < 21) {
    e.preventDefault();
    alert('You must be at least 21 years of age to use our services.');
    return;
  }
  
  if (!waiverAgree.checked) {
    e.preventDefault();
    alert('You must read and agree to the Research Consulting Agreement & Liability Waiver.');
    return;
  }
  
  // Prevent default and submit via fetch, then redirect to Stripe
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'SUBMITTING...';
  btn.disabled = true;

  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      // Redirect to Stripe checkout
      window.location.href = 'https://buy.stripe.com/6oU00l1THg82anR4fH5kk00';
    } else {
      alert('Something went wrong submitting the form. Please try again.');
      btn.textContent = 'Get Started';
      btn.disabled = false;
    }
  })
  .catch(() => {
    alert('Something went wrong submitting the form. Please try again.');
    btn.textContent = 'Get Started';
    btn.disabled = false;
  });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card-large, .service-card-wide, .feature-card, .step, .faq-item, .protocol-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
