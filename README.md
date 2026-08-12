# Hashir Mohi Ud Din — Cybersecurity Portfolio

## Structure
- index.html        — main page (all sections)
- css/style.css      — dark/light theme + all styling
- js/main.js         — theme toggle, nav, custom cursor, 3D hero, particles, scroll reveals, cert modal, form validation
- assets/images/     — profile photo
- assets/certs/      — certificate images shown in the modal viewer

## Run locally
Just open index.html in a browser, or serve the folder:
    python3 -m http.server 8000
then visit http://localhost:8000

## Contact form
The form is front-end only. It currently opens the visitor's email client
(mailto:) pre-filled with their message so it reaches hashir10578@gmail.com.
To receive submissions directly without opening a mail client, connect a
form backend such as Formspree, and update the fetch/submit logic inside
js/main.js (see the "CONTACT FORM" section) — no API keys are stored in
this codebase.

## Notes
- Dark mode is the default; the visitor's choice is remembered (localStorage).
- Certificates are only viewable through the in-page modal — no direct
  download links are exposed in the UI.
- Three.js and GSAP are loaded from cdnjs at runtime for the 3D hero object
  and scroll animations.
