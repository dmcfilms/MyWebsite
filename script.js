/* =========================================================
   DMC FILMS — script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const year = document.querySelector("[data-year]");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  setupWeddingGallery();
  setupPhotographyCategories();
});

/* =========================================================
   WEDDING / BRAND / INTERVIEW / MOTION GALLERY
   (Uses window.projectPhotos — reads from gallery-data.js,
   brand-data.js, interview-data.js, etc.)
   ========================================================= */
function setupWeddingGallery() {
  const gallery = document.getElementById("wedding-gallery");

  if (!gallery) return;

  // Skip on photography.html — that page uses categories instead.
  if (document.getElementById("photo-categories")) return;

  const photos = Array.isArray(window.projectPhotos)
    ? window.projectPhotos
    : [];

  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const closeButton = document.getElementById("lightbox-close");
  const previousButton = document.getElementById("lightbox-previous");
  const nextButton = document.getElementById("lightbox-next");

  let currentIndex = 0;

  if (!photos.length) {
    gallery.innerHTML = "<p>No photos found. Check the data file and image filenames.</p>";
    return;
  }

  photos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.className = "gallery-item";
    button.type = "button";
    button.setAttribute("aria-label", `Open photograph ${index + 1}`);

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt || `Photograph ${index + 1} by DMC Films`;
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("error", () => {
      button.remove();
      console.error(`Missing image: ${photo.src}`);
    });

    button.appendChild(image);
    button.addEventListener("click", () => openLightbox(index));
    gallery.appendChild(button);
  });

  function showImage(index) {
    if (index < 0) {
      currentIndex = photos.length - 1;
    } else if (index >= photos.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const selectedPhoto = photos[currentIndex];
    lightboxImage.src = selectedPhoto.src;
    lightboxImage.alt =
      selectedPhoto.alt || `Photograph ${currentIndex + 1}`;
    lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImage) return;
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.hidden = true;
    lightboxImage.src = "";
    document.body.classList.remove("lightbox-open");
  }

  closeButton?.addEventListener("click", closeLightbox);
  previousButton?.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton?.addEventListener("click", () => showImage(currentIndex + 1));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.hidden) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });
}

/* =========================================================
   PHOTOGRAPHY CATEGORIES
   (Only runs on photography.html — driven by
   window.photographyCategories from photography-data.js)
   ========================================================= */
function setupPhotographyCategories() {
  const categoryContainer = document.getElementById("photo-categories");
  const gallerySection    = document.getElementById("gallery");
  const categorySection   = document.getElementById("categories");
  const galleryContainer  = document.getElementById("wedding-gallery");
  const galleryTitle      = document.getElementById("gallery-title");
  const galleryEyebrow    = document.getElementById("gallery-eyebrow");
  const backBtn           = document.getElementById("back-to-categories");

  // Bail if we're not on photography.html
  if (!categoryContainer || !gallerySection) return;

  const data = window.photographyCategories;
  if (!data) {
    console.warn("[photography] photographyCategories not loaded.");
    return;
  }

  /* ---------- Build category cards ---------- */
  Object.entries(data).forEach(([key, cat]) => {
    const hasImages = Array.isArray(cat.images) && cat.images.length > 0;
    const hasHref   = typeof cat.href === "string" && cat.href.trim() !== "";
    const isActive  = hasImages || hasHref;

    const card = document.createElement(isActive ? "button" : "div");
    card.className = "photo-category-card" + (isActive ? "" : " is-disabled");
    if (isActive) {
      card.type = "button";
      card.dataset.category = key;
    }

    card.innerHTML = `
      <div class="category-image">
        <img src="${cat.cover}" alt="${cat.title}" loading="lazy" />
        ${isActive ? "" : `<span class="category-badge">Coming soon</span>`}
      </div>
      <div class="category-info">
        <h3>${cat.title}</h3>
        <p>${cat.subtitle || ""}</p>
        <span class="category-link">${isActive ? "View Gallery →" : "Coming soon"}</span>
      </div>
    `;

    if (isActive) {
      card.addEventListener("click", () => {
        if (hasHref) {
          window.location.href = cat.href;
        } else {
          showGallery(key);
        }
      });
    }

    categoryContainer.appendChild(card);
  });

  /* ---------- Show/hide logic ---------- */
  function showGallery(categoryKey) {
    const cat = data[categoryKey];
    if (!cat) return;

    galleryTitle.textContent   = cat.title;
    galleryEyebrow.textContent = cat.eyebrow || "Gallery";

    renderProjectGallery(cat.images || []);

    categorySection.hidden = true;
    gallerySection.hidden  = false;
    gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });

    history.replaceState(null, "", `#gallery-${categoryKey}`);
  }

  function showCategories() {
    gallerySection.hidden  = true;
    categorySection.hidden = false;
    categorySection.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", "#categories");
  }

  backBtn?.addEventListener("click", showCategories);

  /* ---------- Deep links: #gallery-wedding ---------- */
  function handleHash() {
    const match = window.location.hash.match(/^#gallery-(\w+)$/);
    if (match && data[match[1]]) showGallery(match[1]);
  }
  window.addEventListener("hashchange", handleHash);
  handleHash();

  /* =========================================================
     Shared gallery renderer for the photography page
     ========================================================= */
  function renderProjectGallery(photos) {
    if (!galleryContainer) return;

    galleryContainer.innerHTML = "";

    if (!photos.length) {
      galleryContainer.innerHTML = "<p>No photos yet in this category.</p>";
      return;
    }

    photos.forEach((photo, index) => {
      const btn = document.createElement("button");
      btn.className = "gallery-item";
      btn.type = "button";
      btn.setAttribute("aria-label", `Open photograph ${index + 1}`);

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || `Photograph ${index + 1}`;
      img.loading = "lazy";
      img.decoding = "async";

      btn.appendChild(img);
      btn.addEventListener("click", () => openPhotoLightbox(photos, index));
      galleryContainer.appendChild(btn);
    });
  }

  /* ---------- Lightbox for photography page ---------- */
  const lightbox        = document.getElementById("gallery-lightbox");
  const lightboxImage   = document.getElementById("lightbox-image");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const closeButton     = document.getElementById("lightbox-close");
  const previousButton  = document.getElementById("lightbox-previous");
  const nextButton      = document.getElementById("lightbox-next");

  let currentPhotos = [];
  let currentIndex  = 0;

  function openPhotoLightbox(photos, index) {
    currentPhotos = photos;
    currentIndex  = index;
    showPhoto();
    if (lightbox) lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function showPhoto() {
    if (!lightboxImage || !currentPhotos.length) return;
    const p = currentPhotos[currentIndex];
    lightboxImage.src = p.src;
    lightboxImage.alt = p.alt || "";
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${currentPhotos.length}`;
    }
  }

  function closePhotoLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImage) lightboxImage.src = "";
    document.body.classList.remove("lightbox-open");
  }

  closeButton?.addEventListener("click", closePhotoLightbox);
  previousButton?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + currentPhotos.length) % currentPhotos.length;
    showPhoto();
  });
  nextButton?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % currentPhotos.length;
    showPhoto();
  });
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closePhotoLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape")     closePhotoLightbox();
    if (e.key === "ArrowLeft")  previousButton?.click();
    if (e.key === "ArrowRight") nextButton?.click();
  });
}