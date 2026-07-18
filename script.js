(function () {
  // --- Reactivar recorte + sombra del carrusel al terminar la animación de carrete ---
  // Mientras .view-stage hace el "carousel-slide-in" el carrusel se ve completo
  // (sin overflow:hidden ni mask-image). En cuanto esa animación termina:
  //   1) se añade .reel-done a .h-carousel -> reactiva overflow:hidden al instante.
  //   2) se anima a mano (requestAnimationFrame) el MISMO mask-image original,
  //      yendo de "sin sombra" a la sombra real, con un ease-out, porque
  //      transicionar mask-image por CSS no se interpola de forma fiable
  //      entre navegadores (por eso antes aparecía de golpe).
  (function initReelShadow() {
    const viewStage = document.querySelector(".view-stage");
    const hCarouselEl = document.querySelector(".h-carousel");
    if (!viewStage || !hCarouselEl) return;

    const ORIGINAL_MASK =
      "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)";

    function fadeInShadow(el, duration = 900) {
      el.style.willChange = "mask-image, -webkit-mask-image";
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cúbico
        const edgeAlpha = 1 - eased; // 1 (sin sombra) -> 0 (sombra completa, igual que el original)
        const gradient = `linear-gradient(90deg, rgba(0,0,0,${edgeAlpha}), #000 6%, #000 94%, rgba(0,0,0,${edgeAlpha}))`;
        el.style.webkitMaskImage = gradient;
        el.style.maskImage = gradient;
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          // Al terminar, fija EXACTAMENTE el degradado original (sin redondeos de alpha)
          el.style.webkitMaskImage = ORIGINAL_MASK;
          el.style.maskImage = ORIGINAL_MASK;
          el.style.willChange = "auto"; // libera la capa GPU, ya no hace falta
        }
      }
      requestAnimationFrame(step);
    }

    viewStage.addEventListener("animationend", (e) => {
      if (e.animationName === "carousel-slide-in") {
        viewStage.style.willChange = "auto"; // la animación de entrada ya terminó, liberar
        hCarouselEl.classList.add("reel-done");
        fadeInShadow(hCarouselEl, 900);
      }
    });
  })();
  const PROYECTOS = [
    {
      id: "v1",
      titulo: "Nocturno",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo1",
    },
    {
      id: "v2",
      titulo: "Aura",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo2",
    },
    {
      id: "v3",
      titulo: "Ríos",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo3",
    },
    {
      id: "v4",
      titulo: "Umbral",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo4",
    },
    {
      id: "v5",
      titulo: "Eco",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo5",
    },
    {
      id: "v6",
      titulo: "Deriva",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo6",
    },
    {
      id: "v7",
      titulo: "Latido",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo7",
    },
    {
      id: "v8",
      titulo: "Marea",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo8",
    },
    {
      id: "v9",
      titulo: "Fuego",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo9",
    },
    {
      id: "v10",
      titulo: "Vigilia",
      subtitulo: "prueba",
      visitas: "1.2k",
      link: "https://vimeo.com/ejemplo10",
    },
  ].map((p) => ({
    ...p,
    src: "./videos/prueba.mp4",
    poster: "./img/NoFotoTarjeta.png",
  }));

  const section = document.getElementById("trabajo");
  const hTrack = document.getElementById("hTrack");
  const vTrack = document.getElementById("vTrack");
  const sideLeft = document.getElementById("sideLeft");
  const sideRight = document.getElementById("sideRight");
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const modalTitle = document.getElementById("modalTitle");
  const modalClose = document.getElementById("modalClose");
  const modalPlayPause = document.getElementById("modalPlayPause");

  // --- Construcción de vistas ---
  function hItemHTML(p) {
    return `
<div class="h-card-wrapper" data-video="${p.id}">
  <div class="h-card-meta">
    <span class="h-card-name">${p.subtitulo}</span>
    <span class="h-card-views">
      <svg viewBox="0 0 24 24">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
      ${p.visitas}
    </span>
  </div>
  <div class="h-item">
    <video muted playsinline preload="metadata" src="${p.src}"></video>
    <img class="h-thumb" src="${p.poster}" alt="${p.titulo}" loading="lazy">
    <button class="h-expand" type="button">Expandir</button>
  </div>
</div>`;
  }

  function vItemHTML(p) {
    return `<div class="v-item" data-video="${p.id}">
<video muted loop playsinline preload="metadata" src="${p.src}"></video>
<img class="v-thumb" src="${p.poster}" alt="${p.titulo}" loading="lazy">
<button class="v-expand" type="button">Expandir</button>
</div>`;
  }

  function sideLiHTML(p) {
    return `<li data-video="${p.id}">
<span class="side-title">${p.titulo}</span>
<span class="side-views">- ${p.visitas}
<svg viewBox="0 0 24 24">
<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
</svg>
</span>
</li>`;
  }

  vTrack.innerHTML = PROYECTOS.map(vItemHTML).join("");
  const mitad = Math.ceil(PROYECTOS.length / 2);
  const izquierda = PROYECTOS.slice(0, mitad);
  const derecha = PROYECTOS.slice(mitad);
  sideLeft.innerHTML = izquierda.map(sideLiHTML).join("");
  sideRight.innerHTML = derecha.map(sideLiHTML).join("");

  // --- Toggles ---
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isViewSwitching) return;
      document.querySelectorAll(".toggle-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      switchView(btn.dataset.viewBtn);
    });
  });

  // --- Transformación Videos <-> Lista ---
  let isViewSwitching = false;
  const VIEW_SWITCH_MS = 700;

  function setHCardsCollapsed(collapsed) {
    hItems.forEach((item, i) => {
      if (collapsed) {
        const offset = Math.abs(i - CENTER_DOM_INDEX);
        const dir = i % 2 === 0 ? -1 : 1;
        item.style.transitionDelay = `${Math.min(offset * 30, 260)}ms`;
        item.style.transform = `scale(.32) translateY(${dir * 90}px)`;
        item.style.opacity = "0";
      } else {
        item.style.transitionDelay = "";
        item.style.transform = "";
        item.style.opacity = "";
      }
    });
  }

  function switchView(target) {
    if (isViewSwitching || section.dataset.view === target) return;
    isViewSwitching = true;

    setHCardsCollapsed(target === "lista");
    section.dataset.view = target;

    setTimeout(() => {
      isViewSwitching = false;
    }, VIEW_SWITCH_MS);
  }

  // --- Carrusel horizontal ---
  const hCarousel = document.querySelector(".h-carousel");
  let isTransitioning = false;

  hTrack.innerHTML = PROYECTOS.map(hItemHTML).join("");
  let hItems = Array.from(hTrack.querySelectorAll(".h-card-wrapper"));

  const CENTER_DOM_INDEX = 4;

  function initializeCircularOrder(targetId) {
    const currentIndex = hItems.findIndex(
      (item) => item.dataset.video === targetId,
    );
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
    hItems = Array.from(hTrack.querySelectorAll(".h-card-wrapper"));
  }

  initializeCircularOrder("v3");

  function updateSelectedItemClasses() {
    hItems.forEach((item, i) => {
      const isSel = i === CENTER_DOM_INDEX;
      item.classList.toggle("is-selected", isSel);
    });
  }

  function centerSelected(animate = true) {
    updateSelectedItemClasses();
    const centerItem = hItems[CENTER_DOM_INDEX];
    const containerWidth = hCarousel.clientWidth;
    const itemOffsetLeft = centerItem.offsetLeft;
    const itemWidth = centerItem.offsetWidth;
    const targetX = containerWidth / 2 - (itemOffsetLeft + itemWidth / 2);

    hTrack.style.transition = animate
      ? "transform .7s cubic-bezier(0.34, 1.56, 0.64, 1)"
      : "none";
    hTrack.style.transform = `translateX(${targetX}px)`;
  }

  function rotateCarousel(steps) {
    if (steps === 0 || isTransitioning) return;
    isTransitioning = true;

    const animateShift = () => {
      const targetDomIndex = CENTER_DOM_INDEX + steps;
      const targetItem = hItems[targetDomIndex];
      const containerWidth = hCarousel.clientWidth;
      const targetX =
        containerWidth / 2 -
        (targetItem.offsetLeft + targetItem.offsetWidth / 2);

      hTrack.style.transition =
        "transform .7s cubic-bezier(0.34, 1.56, 0.64, 1)";
      hTrack.style.transform = `translateX(${targetX}px)`;

      hItems.forEach((item, i) => {
        item.classList.toggle("is-selected", i === targetDomIndex);
      });

      setTimeout(() => {
        if (steps > 0) {
          for (let i = 0; i < steps; i++)
            hTrack.appendChild(hTrack.firstElementChild);
        } else {
          for (let i = 0; i < Math.abs(steps); i++)
            hTrack.insertBefore(
              hTrack.lastElementChild,
              hTrack.firstElementChild,
            );
        }
        hItems = Array.from(hTrack.querySelectorAll(".h-card-wrapper"));
        centerSelected(false);
        isTransitioning = false;
      }, 600);
    };
    requestAnimationFrame(animateShift);
  }

  function attachHItemEvents() {
    hItems.forEach((wrapper) => {
      const item = wrapper.querySelector(".h-item");
      const video = wrapper.querySelector("video");
      const expandBtn = wrapper.querySelector(".h-expand");

      wrapper.addEventListener("mouseenter", () => {
        item.classList.add("is-playing");
        video.currentTime = 0;
        video.play().catch(() => {});
      });

      wrapper.addEventListener("mouseleave", () => {
        item.classList.remove("is-playing");
        video.pause();
      });

      wrapper.addEventListener("click", (e) => {
        if (isTransitioning) return;
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.className = "ripple-drop";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        item.appendChild(ripple);
        setTimeout(() => ripple.remove(), 750);

        const clickedIndex = hItems.indexOf(wrapper);
        rotateCarousel(clickedIndex - CENTER_DOM_INDEX);
      });

      expandBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(wrapper.dataset.video);
      });
    });
  }

  attachHItemEvents();
  centerSelected(false);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => centerSelected(false), 150);
  });

  // --- Vista Lista: carrusel vertical ---
  const vCarousel = document.querySelector(".v-carousel");
  let isVTransitioning = false;
  let vItems = Array.from(vTrack.querySelectorAll(".v-item"));
  const V_CENTER_DOM_INDEX = 4;

  function initializeVCircularOrder(targetId) {
    const currentIndex = vItems.findIndex(
      (item) => item.dataset.video === targetId,
    );
    const diff = currentIndex - V_CENTER_DOM_INDEX;
    if (diff > 0) {
      for (let i = 0; i < diff; i++)
        vTrack.appendChild(vTrack.firstElementChild);
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++)
        vTrack.insertBefore(vTrack.lastElementChild, vTrack.firstElementChild);
    }
    vItems = Array.from(vTrack.querySelectorAll(".v-item"));
  }

  function markActiveVideo(id) {
    vItems.forEach((item) =>
      item.classList.toggle("active", item.dataset.video === id),
    );
    document
      .querySelectorAll(".side-list li")
      .forEach((li) => li.classList.toggle("active", li.dataset.video === id));
  }

  function centerVSelected(animate = true) {
    const centerItem = vItems[V_CENTER_DOM_INDEX];
    markActiveVideo(centerItem.dataset.video);
    const containerHeight = vCarousel.clientHeight;
    const itemOffsetTop = centerItem.offsetTop;
    const itemHeight = centerItem.offsetHeight;
    const targetY = containerHeight / 2 - (itemOffsetTop + itemHeight / 2);

    vTrack.style.transition = animate
      ? "transform .7s cubic-bezier(0.34, 1.56, 0.64, 1)"
      : "none";
    vTrack.style.transform = `translateY(${targetY}px)`;
  }

  function rotateVCarousel(steps) {
    if (steps === 0 || isVTransitioning) return;
    isVTransitioning = true;

    const animateShift = () => {
      const targetDomIndex = V_CENTER_DOM_INDEX + steps;
      const targetItem = vItems[targetDomIndex];
      const containerHeight = vCarousel.clientHeight;
      const targetY =
        containerHeight / 2 -
        (targetItem.offsetTop + targetItem.offsetHeight / 2);

      vTrack.style.transition =
        "transform .7s cubic-bezier(0.34, 1.56, 0.64, 1)";
      vTrack.style.transform = `translateY(${targetY}px)`;
      markActiveVideo(targetItem.dataset.video);

      setTimeout(() => {
        if (steps > 0) {
          for (let i = 0; i < steps; i++)
            vTrack.appendChild(vTrack.firstElementChild);
        } else {
          for (let i = 0; i < Math.abs(steps); i++)
            vTrack.insertBefore(
              vTrack.lastElementChild,
              vTrack.firstElementChild,
            );
        }
        vItems = Array.from(vTrack.querySelectorAll(".v-item"));
        centerVSelected(false);
        isVTransitioning = false;
      }, 600);
    };
    requestAnimationFrame(animateShift);
  }

  function goToVideoInVCarousel(id) {
    if (isVTransitioning) return;
    const idx = vItems.findIndex((item) => item.dataset.video === id);
    if (idx === -1) return;
    if (idx !== V_CENTER_DOM_INDEX) {
      rotateVCarousel(idx - V_CENTER_DOM_INDEX);
    }
  }

  vItems.forEach((item) => {
    const video = item.querySelector("video");
    const expandBtn = item.querySelector(".v-expand");

    item.addEventListener("click", () =>
      goToVideoInVCarousel(item.dataset.video),
    );
    item.addEventListener("mouseenter", () => {
      item.classList.add("is-playing");
      video.currentTime = 0;
      video.play().catch(() => {});
    });
    item.addEventListener("mouseleave", () => {
      item.classList.remove("is-playing");
      video.pause();
    });

    expandBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(item.dataset.video);
    });
  });

  document.querySelectorAll(".side-list li").forEach((li) => {
    li.addEventListener("click", () => goToVideoInVCarousel(li.dataset.video));
  });

  let vWheelLocked = false;
  vCarousel.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (isVTransitioning || vWheelLocked) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      vWheelLocked = true;
      rotateVCarousel(dir);
      setTimeout(() => {
        vWheelLocked = false;
      }, 180);
    },
    { passive: false },
  );

  initializeVCircularOrder("v3");
  centerVSelected(false);

  let vResizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(vResizeTimer);
    vResizeTimer = setTimeout(() => centerVSelected(false), 150);
  });

  // --- Manejo del Modal ---
  function openModal(id) {
    const proyecto = PROYECTOS.find((p) => p.id === id);
    if (!proyecto) return;
    modalVideo.src = proyecto.src;
    modalTitle.textContent = proyecto.titulo;

    document.getElementById("modalInfoLink").href = proyecto.link || "#";

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "true");

    modalVideo
      .play()
      .then(() => {
        modalPlayPause.classList.remove("visible");
        modalPlayPause.classList.add("is-playing");
      })
      .catch(() => {
        modalPlayPause.classList.add("visible");
        modalPlayPause.classList.remove("is-playing");
      });
  }

  function closeModal() {
    modal.classList.remove("open");
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
    modalPlayPause.classList.remove("visible", "is-playing", "flash");
  }

  function togglePlay() {
    modalPlayPause.classList.remove("flash");

    if (modalVideo.paused) {
      modalVideo
        .play()
        .then(() => {
          modalPlayPause.classList.remove("visible");
          modalPlayPause.classList.add("is-playing");
          void modalPlayPause.offsetWidth;
          modalPlayPause.classList.add("flash");
          setTimeout(() => {
            modalPlayPause.classList.remove("flash");
          }, 750);
        })
        .catch(() => {});
    } else {
      modalVideo.pause();
      modalPlayPause.classList.remove("is-playing");
      modalPlayPause.classList.add("visible");
    }
  }

  modalVideo.addEventListener("click", togglePlay);
  modalPlayPause.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlay();
  });

  modalVideo.addEventListener("ended", closeModal);
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();

// ===========================
// MENÚ LATERAL
// ===========================
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
// const overlay   = document.getElementById('overlay');
const navLinks = document.querySelectorAll(".nav-link");

function openMenu() {
  sidebar.classList.add("open");
  //   overlay.classList.add('active');
  menuBtn.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  sidebar.classList.remove("open");
  //   overlay.classList.remove('active');
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", () => {
  sidebar.classList.contains("open") ? closeMenu() : openMenu();
});
// overlay.addEventListener('click', closeMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
    closeModal();
  }
});

// Resalta el enlace activo del menú según la sección visible
const sections = document.querySelectorAll(".section, .hero");
const sidebarLinks = document.querySelectorAll(".sidebar-links a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        sidebarLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      }
    });
  },
  { threshold: 0.4 },
);

sections.forEach((section) => {
  if (section.id) sectionObserver.observe(section);
});
