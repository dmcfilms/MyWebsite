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
});

function setupWeddingGallery() {
  const gallery = document.getElementById("wedding-gallery");

  if (!gallery) return;

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
    gallery.innerHTML = "<p>No photos found. Check gallery-data.js and the image filenames.</p>";
    return;
  }

  photos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.className = "gallery-item";
    button.type = "button";
    button.setAttribute("aria-label", `Open wedding photograph ${index + 1}`);

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt || `Wedding photograph ${index + 1} by DMC Films`;
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
      selectedPhoto.alt || `Wedding photograph ${currentIndex + 1}`;
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
