// ===== NAVIGATION TOGGLE =====
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (!hamburger || !nav) return;
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
    const spans = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('open');
    if (hamburger.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ===== ACTIVE NAV LINK =====
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ===== ADMISSION FORM =====
function initAdmissionForm() {
  const form = document.getElementById('admissionForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm(form)) return;
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    setTimeout(() => {
      form.style.display = 'none';
      document.getElementById('successMsg').style.display = 'block';
    }, 1200);
  });
  // Upload box click
  const uploadBox = document.querySelector('.upload-box');
  const fileInput = document.getElementById('docUpload');
  if (uploadBox && fileInput) {
    uploadBox.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const label = uploadBox.querySelector('p');
      if (fileInput.files.length > 0) {
        label.textContent = `✓ ${fileInput.files.length} file(s) selected`;
        label.style.color = '#16a34a';
        uploadBox.style.borderColor = '#16a34a';
      }
    });
  }
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#dc2626';
      field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      valid = false;
    }
  });
  if (!valid) {
    showToast('Please fill all required fields.', 'error');
  }
  return valid;
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Thank you! Your message has been sent.', 'success');
    form.reset();
  });
}

// ===== ADMIN LOGIN =====
function initAdminLogin() {
  const form = document.getElementById('adminLoginForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    if (user === 'admin' && pass === 'school@2024') {
      document.getElementById('loginSection').classList.add('hidden');
      document.getElementById('dashboardSection').classList.remove('hidden');
    } else {
      showToast('Invalid credentials. Try admin / school@2024', 'error');
    }
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const existing = document.getElementById('toastNotif');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toastNotif';
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: ${type === 'success' ? '#16a34a' : '#dc2626'};
    color: white; padding: 14px 24px; border-radius: 10px;
    font-size: 0.9rem; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: slideInUp 0.3s ease; max-width: 320px;
  `;
  toast.textContent = (type === 'success' ? '✓ ' : '✗ ') + message;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.card, .facility-card, .staff-card, .teacher-card, .vm-card, .benefit-card, .ict-feature, .resource-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { el.textContent = target + (el.dataset.suffix || ''); clearInterval(timer); }
          else { el.textContent = Math.floor(current) + (el.dataset.suffix || ''); }
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setActiveNav();
  initAdmissionForm();
  initContactForm();
  initAdminLogin();
  initScrollAnimations();
  initCounters();

  // Add slideInUp animation
  const style = document.createElement('style');
  style.textContent = `@keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
  document.head.appendChild(style);
});
