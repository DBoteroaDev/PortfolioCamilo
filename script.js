// ===========================
// MENÚ LATERAL
// ===========================
const menuBtn   = document.getElementById('menuBtn');
const closeBtn  = document.getElementById('closeBtn');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');
const navLinks  = document.querySelectorAll('.nav-link');

function openMenu(){
  sidebar.classList.add('open');
  overlay.classList.add('active');
  menuBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu(){
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeMenu() : openMenu();
});
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){
    closeMenu();
    closeModal();
  }
});

// Resalta el enlace activo del menú según la sección visible
const sections = document.querySelectorAll('.section, .hero');
const sidebarLinks = document.querySelectorAll('.sidebar-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const id = entry.target.id;
      sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => {
  if (section.id) sectionObserver.observe(section);
});

// ===========================
// FILTROS DE VÍDEO
// ===========================
const filterBtns = document.querySelectorAll('.filter-btn');
const videoCards  = document.querySelectorAll('.video-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    videoCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// ===========================
// MODAL DE VÍDEO
// ===========================
const videoModal = document.getElementById('videoModal');
const modalTitle  = document.getElementById('modalTitle');
const modalDesc   = document.getElementById('modalDesc');
const modalClose  = document.getElementById('modalClose');

videoCards.forEach(card => {
  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.title || 'Proyecto';
    modalDesc.textContent  = card.dataset.desc || '';
    videoModal.hidden = false;
  });
});

function closeModal(){
  videoModal.hidden = true;
}
modalClose.addEventListener('click', closeModal);
videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) closeModal();
});

// ===========================
// VALIDACIÓN DEL FORMULARIO
// ===========================
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

const validators = {
  name: (v) => v.trim().length >= 2 || 'Escribe tu nombre completo.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Introduce un correo válido.',
  projectType: (v) => v !== '' || 'Selecciona un tipo de proyecto.',
  message: (v) => v.trim().length >= 10 || 'Cuéntame un poco más (mínimo 10 caracteres).'
};

function validateField(field){
  const row = field.closest('.form-row');
  const errorEl = row.querySelector('.error-msg');
  const result = validators[field.name](field.value);

  if (result === true){
    row.classList.remove('error');
    errorEl.textContent = '';
    return true;
  } else {
    row.classList.add('error');
    errorEl.textContent = result;
    return false;
  }
}

['name','email','projectType','message'].forEach(fieldName => {
  const field = form.elements[fieldName];
  field.addEventListener('blur', () => validateField(field));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  successMsg.hidden = true;

  let allValid = true;
  ['name','email','projectType','message'].forEach(fieldName => {
    const field = form.elements[fieldName];
    if (!validateField(field)) allValid = false;
  });

  if (allValid){
    // Aquí se conectaría con un backend / servicio de envío de correo real.
    successMsg.hidden = false;
    form.reset();
    document.querySelectorAll('.form-row').forEach(r => r.classList.remove('error'));
  }
});