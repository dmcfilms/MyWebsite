# DMC Films Portfolio Website

A premium, modern local portfolio website for DMC Films, built with plain HTML, CSS and vanilla JavaScript.

## 1. How to Open the Site Locally

Open `index.html` in your browser.

You can double-click the file, or right-click it and choose your preferred browser. No installation or build step is required.

## 2. How to Replace the Reel Video

Place your final reel video here:

```text
assets/video/reel.mp4
```

The video is already connected in `index.html`:

```html
<source src="assets/video/reel.mp4" type="video/mp4" />
```

If you use a different filename, update that line in `index.html`.

Recommended format: MP4, H.264, under 50MB if possible.

To replace the poster image, add a still image here:

```text
assets/img/poster.jpg
```

## 3. How to Replace Project Images

Add your project thumbnails using these filenames:

```text
assets/img/project-1.jpg
assets/img/project-2.jpg
assets/img/project-3.jpg
```

For best results, use horizontal or vertical cinematic images at least 1200px wide.

If you want to add more projects, copy one of the existing `.work-card` blocks in `index.html` and update the image, title and category.

## 4. How to Edit Text

Most text is inside `index.html`.

Common edits:

- Hero headline and intro: search for the `<section class="hero section">` area.
- Services: search for `id="services"`.
- Project titles: search for `id="work"`.
- About text: search for `id="about"`.
- Contact links: search for `id="contact"`.

The contact buttons currently use placeholder links. Replace them with the real email, Instagram, Behance and LinkedIn URLs.

## 5. How to Upload the Website Later

Upload these files and folders to your hosting provider:

```text
index.html
style.css
script.js
assets/
```

Good beginner-friendly hosting options include Netlify, Vercel, GitHub Pages and standard cPanel hosting.

Make sure the `assets` folder stays beside `index.html`, because the website uses paths like `assets/img/project-1.jpg`.

## 6. Video Format Recommendation

Use:

- MP4 video
- H.264 codec
- 1920x1080 or 1280x720 resolution
- Under 50MB if possible
- Short reel length for faster loading

Large video files can make the site feel slow, especially on mobile connections.
