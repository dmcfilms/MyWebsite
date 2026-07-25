window.motionVideos = [
  
  
  {
    "title": "ForHope Recap 2024",
    "category": "Motion Design",
    "description": "Replace this information in motion-videos.js.",
    "thumbnail": "assets/img/motion/Motion-02.png",
    "behanceUrl": "https://www.behance.net/gallery/221109269/ForHope-Recap-2024"
  },
  {
    "title": "ForHope Association Motion Series",
    "category": "Brand Animation",
    "description": "Replace this information in motion-videos.js.",
    "thumbnail": "assets/img/motion/Motion-03.jpeg",
    "behanceUrl": "https://www.behance.net/gallery/201969169/ForHope-Association"
  },
  {
    "title": "Ajoola - Le Bil du Mak",
    "category": "Animated Explainer",
    "description": "Replace this information in motion-videos.js.",
    "thumbnail": "assets/img/motion/Motion-04.png",
    "behanceUrl": "https://www.behance.net/gallery/193304117/Ajoola-Le-Bil-du-Mak-Official-Videos-lyrics"
  },
  {
    "title": "ERT (Etude, Realisation, Technique)",
    "category": "Brand Animation",
    "description": "Replace this information in motion-videos.js.",
    "thumbnail": "assets/img/motion/Motion-05.jpeg",
    "behanceUrl": "https://www.behance.net/gallery/204364063/ERT-%28Etude-Realisation-Technique%29"
  },
  {
    "title": "CCBM Packshot Animation",
    "category": "Title Design",
    "description": "Replace this information in motion-videos.js.",
    "thumbnail": "assets/img/motion/Motion-06.png",
    "behanceUrl": "https://www.behance.net/gallery/229992889/CCBM-PACKSHOT"
  },


];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("motion-video-grid");
  if (!grid) return;

  const videos = Array.isArray(window.motionVideos) ? window.motionVideos : [];

  if (!videos.length) {
    grid.innerHTML = "<p>No motion projects have been added yet.</p>";
    return;
  }

  videos.forEach((video, index) => {
    const hasLink = typeof video.behanceUrl === "string" && video.behanceUrl.trim() !== "";
    const card = document.createElement(hasLink ? "a" : "article");

    card.className = hasLink ? "motion-video-card" : "motion-video-card is-disabled";

    if (hasLink) {
      card.href = video.behanceUrl;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }

    const media = document.createElement("div");
    media.className = "motion-video-thumbnail";

    const image = document.createElement("img");
    image.src = video.thumbnail;
    image.alt = video.title;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      media.classList.add("thumbnail-missing");
      image.remove();
    });

    const play = document.createElement("span");
    play.className = "motion-video-play";
    play.textContent = hasLink ? "▶" : "+";

    const content = document.createElement("div");
    content.className = "motion-video-content";
    content.innerHTML = `
      <p class="motion-video-category">${video.category || "Motion Design"}</p>
      <h2>${video.title || `Motion Project ${index + 1}`}</h2>
      <p class="motion-video-description">${video.description || ""}</p>
      <span class="motion-video-action">${hasLink ? "View on Behance ↗" : "Add Behance link"}</span>
    `;

    media.append(image, play);
    card.append(media, content);
    grid.appendChild(card);
  });
});
