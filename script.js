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
  
  // Validate at least one service selected
  const checkedServices = form.querySelectorAll('.service-option input[type="checkbox"]:checked');
  if (checkedServices.length === 0) {
    e.preventDefault();
    alert('Please select at least one service before submitting.');
    return;
  }

  // Prevent default and submit via fetch, then redirect to Stripe
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'SUBMITTING...';
  btn.disabled = true;

  // Add addon quantity to form data
  const formData = new FormData(form);
  const addonChecked = form.querySelector('input[name="service_addon"]').checked;
  if (addonChecked) {
    formData.set('addon_quantity', document.getElementById('addonQty').textContent);
  }

  // Build summary of selected services
  const serviceNames = [];
  if (form.querySelector('input[name="service_initial"]').checked) serviceNames.push('Initial Setup ($99)');
  if (addonChecked) serviceNames.push('Add-on x' + document.getElementById('addonQty').textContent + ' ($24.99 each)');
  if (form.querySelector('input[name="service_monitoring"]').checked) serviceNames.push('Monthly Monitoring ($99/mo)');
  formData.set('services_selected', serviceNames.join(', '));

  // Stripe links
  const stripeLinks = {
    'initial': 'https://buy.stripe.com/00w3cx7e1094brVbI95kk04',
    'addon': 'https://buy.stripe.com/9B6dRbaqd2hceE727z5kk01',
    'monitoring': 'https://buy.stripe.com/6oUeVffKxf3YgMffYp5kk02'
  };

  // Determine which Stripe link to redirect to (prioritize initial > monitoring > addon)
  let redirectTo = '';
  if (form.querySelector('input[name="service_initial"]').checked) {
    redirectTo = stripeLinks['initial'];
  } else if (form.querySelector('input[name="service_monitoring"]').checked) {
    redirectTo = stripeLinks['monitoring'];
  } else if (addonChecked) {
    redirectTo = stripeLinks['addon'];
  }

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(response => {
    if (response.ok) {
      window.location.href = redirectTo;
    } else {
      alert('Something went wrong submitting the form. Please try again.');
      btn.textContent = 'Submit & Pay';
      btn.disabled = false;
    }
  })
  .catch(() => {
    alert('Something went wrong submitting the form. Please try again.');
    btn.textContent = 'Submit & Pay';
    btn.disabled = false;
  });
});

// ===== SERVICE SELECTION LOGIC =====
const addonCheckbox = document.getElementById('addonCheckbox');
const addonQtyWrap = document.getElementById('addonQtyWrap');
const addonQty = document.getElementById('addonQty');
const addonMinus = document.getElementById('addonMinus');
const addonPlus = document.getElementById('addonPlus');
const serviceTotalEl = document.getElementById('serviceTotal');
const totalAmountEl = document.getElementById('totalAmount');
const totalNoteEl = document.getElementById('totalNote');

let addonCount = 1;

// Show/hide addon quantity when checked
addonCheckbox.addEventListener('change', () => {
  addonQtyWrap.style.display = addonCheckbox.checked ? 'flex' : 'none';
  if (!addonCheckbox.checked) { addonCount = 1; addonQty.textContent = '1'; }
  updateTotal();
});

addonMinus.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (addonCount > 1) { addonCount--; addonQty.textContent = addonCount; updateTotal(); }
});

addonPlus.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  addonCount++;
  addonQty.textContent = addonCount;
  updateTotal();
});

// Update total on any service checkbox change
document.querySelectorAll('.service-option input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', updateTotal);
});

function updateTotal() {
  let total = 0;
  let hasMonthly = false;
  
  if (form.querySelector('input[name="service_initial"]').checked) total += 99;
  if (addonCheckbox.checked) total += 24.99 * addonCount;
  if (form.querySelector('input[name="service_monitoring"]').checked) { total += 99; hasMonthly = true; }
  
  const anyChecked = document.querySelectorAll('.service-option input[type="checkbox"]:checked').length > 0;
  serviceTotalEl.style.display = anyChecked ? 'flex' : 'none';
  totalAmountEl.textContent = '$' + total.toFixed(2);
  totalNoteEl.textContent = hasMonthly ? '+ $99/mo recurring' : '';
}

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
