(function () {
  // ------------------------------------------------------------------
  // 1) TUS PROYECTOS (Rutas modificadas localmente)
  // ------------------------------------------------------------------
  const PROYECTOS = [
    { id: 'v1', titulo: 'Nocturno' },
    { id: 'v2', titulo: 'Aura' },
    { id: 'v3', titulo: 'Ríos' },
    { id: 'v4', titulo: 'Umbral' },
    { id: 'v5', titulo: 'Eco' },
    { id: 'v6', titulo: 'Deriva' },
    { id: 'v7', titulo: 'Latido' },
    { id: 'v8', titulo: 'Marea' },
    { id: 'v9', titulo: 'Fuego' },
    { id: 'v10', titulo: 'Vigilia' },
  ].map(p => ({ ...p, src: './videos/prueba.mp4', poster: './img/NoFotoTarjeta.png' }));

  const section = document.getElementById('trabajo');
  const hTrack = document.getElementById('hTrack');
  const vTrack = document.getElementById('vTrack');
  const sideLeft = document.getElementById('sideLeft');
  const sideRight = document.getElementById('sideRight');
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');

  // ------------------------------------------------------------------
  // 2) Construcción de las vistas
  // ------------------------------------------------------------------
  function hItemHTML(p) {
    return `<div class="h-item" data-video="${p.id}">
<video muted playsinline preload="none" src="${p.src}"></video>
<img class="h-thumb" src="${p.poster}" alt="${p.titulo}" loading="lazy">
<span class="h-title">${p.titulo}</span>
<button class="h-expand" type="button">Expandir</button>
</div>`;
  }
  function vItemHTML(p) {
    return `<div class="v-item" data-video="${p.id}">
<video muted loop playsinline preload="none" src="${p.src}"></video>
</div>`;
  }

  vTrack.innerHTML = PROYECTOS.map(vItemHTML).join('') + PROYECTOS.map(vItemHTML).join('');
  const mitad = Math.ceil(PROYECTOS.length / 2);
  const izquierda = PROYECTOS.slice(0, mitad);
  const derecha = PROYECTOS.slice(mitad);
  sideLeft.innerHTML = izquierda.map(p => `<li data-video="${p.id}">${p.titulo}</li>`).join('');
  sideRight.innerHTML = derecha.map(p => `<li data-video="${p.id}">${p.titulo}</li>`).join('');

  // ------------------------------------------------------------------
  // 3) Toggle Videos / Lista
  // ------------------------------------------------------------------
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      section.dataset.view = btn.dataset.viewBtn;
    });
  });

  // ------------------------------------------------------------------
  // 4) Carrusel horizontal infinito sin duplicar elementos
  // ------------------------------------------------------------------
  const hCarousel = document.querySelector('.h-carousel');
  let isTransitioning = false;

  hTrack.innerHTML = PROYECTOS.map(hItemHTML).join('');
  let hItems = Array.from(hTrack.querySelectorAll('.h-item'));

  const CENTER_DOM_INDEX = 4;

  function getSelectedItem() {
    return hItems[CENTER_DOM_INDEX];
  }

  function initializeCircularOrder(targetId) {
    const targetIndex = PROYECTOS.findIndex(p => p.id === targetId);
    const currentIndex = hItems.findIndex(item => item.dataset.video === targetId);
    const diff = currentIndex - CENTER_DOM_INDEX;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        hTrack.appendChild(hTrack.firstElementChild);
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        hTrack.insertBefore(hTrack.lastElementChild, hTrack.firstElementChild);
      }
    }
    hItems = Array.from(hTrack.querySelectorAll('.h-item'));
  }

  initializeCircularOrder('v3');

  function updateSelectedItemClasses() {
    hItems.forEach((item, i) => {
      const isSel = i === CENTER_DOM_INDEX;
      item.classList.toggle('is-selected', isSel);
    });
  }

  function centerSelected(animate = true) {
    updateSelectedItemClasses();

    const centerItem = hItems[CENTER_DOM_INDEX];
    const containerWidth = hCarousel.clientWidth;

    const itemOffsetLeft = centerItem.offsetLeft;
    const itemWidth = centerItem.offsetWidth;
    const targetX = containerWidth / 2 - (itemOffsetLeft + itemWidth / 2);

    if (animate) {
      // Transición elástica de gota de agua
      hTrack.style.transition = "transform .7s cubic-bezier(0.34, 1.56, 0.64, 1)";
    } else {
      hTrack.style.transition = "none";
    }
    hTrack.style.transform = `translateX(${targetX}px)`;
  }

  function rotateCarousel(steps) {
    if (steps === 0 || isTransitioning) return;
    isTransitioning = true;

    const animateShift = () => {
      const targetDomIndex = CENTER_DOM_INDEX + steps;
      const targetItem = hItems[targetDomIndex];

      const containerWidth = hCarousel.clientWidth;
      const targetX = containerWidth / 2 - (targetItem.offsetLeft + targetItem.offsetWidth / 2);

      // Transición elástica de gota de agua
      hTrack.style.transition = "transform .7s cubic-bezier(0.34, 1.56, 0.64, 1)";
      hTrack.style.transform = `translateX(${targetX}px)`;

      hItems.forEach((item, i) => {
        const isSel = i === targetDomIndex;
        item.classList.toggle('is-selected', isSel);
      });

      setTimeout(() => {
        if (steps > 0) {
          for (let i = 0; i < steps; i++) {
            hTrack.appendChild(hTrack.firstElementChild);
          }
        } else {
          for (let i = 0; i < Math.abs(steps); i++) {
            hTrack.insertBefore(hTrack.lastElementChild, hTrack.firstElementChild);
          }
        }

        hItems = Array.from(hTrack.querySelectorAll('.h-item'));
        centerSelected(false);
        isTransitioning = false;
      }, 600);
    };

    requestAnimationFrame(animateShift);
  }

  function attachHItemEvents() {
    hItems.forEach((item) => {
      const video = item.querySelector('video');
      const expandBtn = item.querySelector('.h-expand');

      item.addEventListener('mouseenter', () => {
        item.classList.add('is-playing');
        video.currentTime = 0;
        video.play().catch(() => { });
      });

      item.addEventListener('mouseleave', () => {
        item.classList.remove('is-playing');
        video.pause();
      });

      video.addEventListener('ended', () => {
        item.classList.remove('is-playing');
      });

      item.addEventListener('click', (e) => {
        if (isTransitioning) return;

        // --- EFECTO GOTA DE AGUA EN CLIC ---
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-drop';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        item.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 750);
        // -----------------------------------

        const clickedIndex = hItems.indexOf(item);
        const steps = clickedIndex - CENTER_DOM_INDEX;
        rotateCarousel(steps);
      });

      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(item.dataset.video);
      });
    });
  }

  attachHItemEvents();
  centerSelected(false);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => centerSelected(false), 150);
  });

  // ------------------------------------------------------------------
  // 5) Vista Lista: marcar nombre al pasar el vídeo, clic = grande
  // ------------------------------------------------------------------
  function setActiveName(id) {
    document.querySelectorAll('.side-list li').forEach(li => {
      li.classList.toggle('active', li.dataset.video === id);
    });
    document.querySelectorAll('.v-item').forEach(v => {
      v.classList.toggle('active', v.dataset.video === id);
    });
  }

  function clearActiveName() {
    document.querySelectorAll('.side-list li, .v-item').forEach(el => el.classList.remove('active'));
  }

  vTrack.querySelectorAll('.v-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      section.classList.add('is-v-hover');
      setActiveName(item.dataset.video);
    });
    item.addEventListener('click', () => openModal(item.dataset.video));
  });

  vTrack.addEventListener('mouseleave', () => {
    section.classList.remove('is-v-hover');
    clearActiveName();
  });

  document.querySelectorAll('.side-list li').forEach(li => {
    li.addEventListener('mouseenter', () => setActiveName(li.dataset.video));
    li.addEventListener('mouseleave', clearActiveName);
    li.addEventListener('click', () => openModal(li.dataset.video));
  });

  // ------------------------------------------------------------------
  // 6) Modal a pantalla grande
  // ------------------------------------------------------------------
  function openModal(id) {
    const proyecto = PROYECTOS.find(p => p.id === id);
    if (!proyecto) return;
    modalVideo.src = proyecto.src;
    modalTitle.textContent = proyecto.titulo;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    modalVideo.play().catch(() => { });
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

// ===========================
// MENÚ LATERAL
// ===========================
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
// const overlay   = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-link');

function openMenu() {
  sidebar.classList.add('open');
  //   overlay.classList.add('active');
  menuBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
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
  if (e.key === 'Escape') {
    closeMenu();
    closeModal();
  }
});

// Resalta el enlace activo del menú según la sección visible
const sections = document.querySelectorAll('.section, .hero');
const sidebarLinks = document.querySelectorAll('.sidebar-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
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