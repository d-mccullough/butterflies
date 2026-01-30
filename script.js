const navLinks = Array.from(document.querySelectorAll('[data-nav].nav-link'));
const nav = document.getElementById('primary-nav');
const toggleBtn = document.querySelector('.nav-toggle');

function setActiveLinkByHash(hash) {
  const id = (hash || '#home').replace('#', '');
  navLinks.forEach((a) => {
    const isActive = a.getAttribute('href') === `#${id}`;
    a.classList.toggle('active', isActive);
  });
}

function closeMobileNav() {
  if (!nav || !toggleBtn) return;
  nav.classList.remove('is-open');
  toggleBtn.setAttribute('aria-expanded', 'false');
}

function openMobileNav() {
  if (!nav || !toggleBtn) return;
  nav.classList.add('is-open');
  toggleBtn.setAttribute('aria-expanded', 'true');
}

function toggleMobileNav() {
  const isOpen = nav.classList.contains('is-open');
  if (isOpen) closeMobileNav();
  else openMobileNav();
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', toggleMobileNav);
}

Array.from(document.querySelectorAll('[data-nav]')).forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
      setActiveLinkByHash(href);
    }

    closeMobileNav();
  });
});

const sectionIds = ['home', 'about', 'services', 'outpatient', 'resources', 'contact'];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && visible.target && visible.target.id) {
        setActiveLinkByHash(`#${visible.target.id}`);
      }
    },
    {
      root: null,
      threshold: [0.2, 0.35, 0.5, 0.65],
    }
  );

  sections.forEach((s) => io.observe(s));
}

window.addEventListener('hashchange', () => {
  setActiveLinkByHash(window.location.hash);
});

setActiveLinkByHash(window.location.hash);

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Tab switching for Outpatient section
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');
    
    // Remove active class from all buttons and panels
    tabBtns.forEach((b) => b.classList.remove('active'));
    tabPanels.forEach((p) => p.classList.remove('active'));
    
    // Add active class to clicked button and corresponding panel
    btn.classList.add('active');
    const panel = document.getElementById(`${tabId}-panel`);
    if (panel) panel.classList.add('active');
  });
});

// Contact form submission feedback
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    const submitBtn = this.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
        Sending...
      `;
      submitBtn.disabled = true;
    }
  });
}
