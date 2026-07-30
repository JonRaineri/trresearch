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
  e.preventDefault();
  
  // Validate age (must be 21+)
  const dob = new Date(form.dob.value);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  if (age < 21) {
    alert('You must be at least 21 years of age to use our services.');
    return;
  }
  
  if (!waiverAgree.checked) {
    alert('You must read and agree to the Research Consulting Agreement & Liability Waiver.');
    return;
  }
  
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  
  btn.textContent = 'SUBMITTING...';
  btn.disabled = true;
  
  setTimeout(() => {
    btn.textContent = 'REQUEST SUBMITTED ✓';
    btn.style.background = '#2D8B4E';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
      waiverAgree.disabled = true;
      waiverScrolledToBottom = false;
      waiverHint.classList.remove('hidden');
      submitBtn.disabled = true;
    }, 3000);
  }, 1500);
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
