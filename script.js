// ===========================
// MENÚ LATERAL
// ===========================
const menuBtn   = document.getElementById('menuBtn');
const sidebar   = document.getElementById('sidebar');
// const overlay   = document.getElementById('overlay');
const navLinks  = document.querySelectorAll('.nav-link');

function openMenu(){
  sidebar.classList.add('open');
//   overlay.classList.add('active');
  menuBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu(){
  sidebar.classList.remove('open');
//   overlay.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeMenu() : openMenu();
});
// overlay.addEventListener('click', closeMenu);

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