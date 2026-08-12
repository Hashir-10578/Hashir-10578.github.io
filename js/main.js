(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ============================================================
     THEME (dark default, persisted)
     ============================================================ */
  var root = document.body;
  var themeToggle = document.getElementById('themeToggle');
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (e) {}
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-theme', savedTheme);
  }
  function currentTheme() { return root.getAttribute('data-theme') || 'dark'; }
  themeToggle.setAttribute('aria-pressed', currentTheme() === 'light' ? 'true' : 'false');

  themeToggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    themeToggle.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
    try { localStorage.setItem('portfolio-theme', next); } catch (e) {}
  });

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', function () {
    var open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============================================================
     HEADER SCROLL STATE + ACTIVE SECTION
     ============================================================ */
  var header = document.getElementById('siteHeader');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main .section, .hero'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.toggle('active', l.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  if (!isTouch) {
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function raf() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(raf);
    })();
    var hoverables = 'a, button, .skill-card, .project-card, .timeline-card, .cert-body, input, textarea';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverables)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverables)) ring.classList.remove('hover');
    });
  }

  /* ============================================================
     ROLE CYCLE TEXT (About headline)
     ============================================================ */
  var roles = ['Software Engineer', 'Penetration Tester', 'Cybersecurity Engineer'];
  var roleEl = document.getElementById('roleCycle');
  if (roleEl && !reduceMotion) {
    var ri = 0;
    setInterval(function () {
      ri = (ri + 1) % roles.length;
      roleEl.style.opacity = 0;
      setTimeout(function () {
        roleEl.textContent = roles[ri];
        roleEl.style.opacity = 1;
      }, 260);
    }, 2800);
    roleEl.style.transition = 'opacity .26s ease';
  }

  /* ============================================================
     BACKGROUND NETWORK PARTICLES (canvas)
     ============================================================ */
  (function networkBackground() {
    var canvas = document.getElementById('net-canvas');
    var ctx = canvas.getContext('2d');
    var w, h, points, animId;
    var DENSITY = isTouch ? 22000 : 13000;

    function themeColor() {
      return getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#22E5C4';
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      var count = Math.min(90, Math.floor((w * h) / DENSITY));
      points = [];
      for (var i = 0; i < count; i++) {
        points.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      var color = themeColor();
      ctx.fillStyle = color;
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = color;
      for (i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
          var dx = points[i].x - points[j].x, dy = points[i].y - points[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.globalAlpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    if (!reduceMotion) {
      tick();
    } else {
      // static single frame
      tick(); cancelAnimationFrame(animId);
    }
  })();

  /* ============================================================
     HERO 3D — abstract security sphere (Three.js)
     ============================================================ */
  (function hero3D() {
    var canvas = document.getElementById('hero-3d');
    if (!canvas || typeof THREE === 'undefined') return;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    var group = new THREE.Group();
    scene.add(group);

    // Icosahedron wireframe "shield core"
    var coreGeo = new THREE.IcosahedronGeometry(2.4, 1);
    var coreMat = new THREE.MeshBasicMaterial({ color: 0x22e5c4, wireframe: true, transparent: true, opacity: 0.55 });
    var core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    var innerGeo = new THREE.IcosahedronGeometry(1.5, 0);
    var innerMat = new THREE.MeshBasicMaterial({ color: 0x4c8cff, wireframe: true, transparent: true, opacity: 0.4 });
    var inner = new THREE.Mesh(innerGeo, innerMat);
    group.add(inner);

    // orbit rings
    var ringGeo = new THREE.TorusGeometry(3.2, 0.008, 8, 100);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0x22e5c4, transparent: true, opacity: 0.35 });
    var ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.4;
    group.add(ring1);
    var ring2 = new THREE.Mesh(ringGeo.clone(), ringMat.clone());
    ring2.rotation.x = Math.PI / 1.6;
    ring2.rotation.y = Math.PI / 3;
    ring2.scale.setScalar(0.82);
    group.add(ring2);

    // node points scattered on sphere
    var nodeCount = 40;
    var nodeGeo = new THREE.BufferGeometry();
    var positions = new Float32Array(nodeCount * 3);
    for (var i = 0; i < nodeCount; i++) {
      var phi = Math.acos(-1 + (2 * i) / nodeCount);
      var theta = Math.sqrt(nodeCount * Math.PI) * phi;
      var r = 2.9;
      positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var nodeMat = new THREE.PointsMaterial({ color: 0x22e5c4, size: 0.07, transparent: true, opacity: 0.85 });
    var nodePoints = new THREE.Points(nodeGeo, nodeMat);
    group.add(nodePoints);

    function resize() {
      var wrap = canvas.parentElement;
      var width = wrap.clientWidth, height = wrap.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    var targetRotX = 0, targetRotY = 0;
    window.addEventListener('mousemove', function (e) {
      targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.6;
      targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.4;
    });

    var scrollFactor = 0;
    window.addEventListener('scroll', function () {
      scrollFactor = Math.min(window.scrollY / 900, 1);
    }, { passive: true });

    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      if (!reduceMotion) {
        group.rotation.y += 0.0022;
        group.rotation.x += (targetRotX - group.rotation.x) * 0.03;
        group.rotation.y += (targetRotY - group.rotation.y) * 0.02;
        ring1.rotation.z = t * 0.15;
        ring2.rotation.z = -t * 0.12;
        core.rotation.y = t * 0.05;
      }
      group.position.y = -scrollFactor * 1.4;
      group.scale.setScalar(1 - scrollFactor * 0.15);
      renderer.render(scene, camera);
    }
    animate();
  })();

  /* ============================================================
     GSAP SCROLL-TRIGGERED (REPEATABLE) REVEALS — smooth, batched
     ============================================================ */
  (function scrollReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // fallback: reveal everything immediately via the CSS transition path
      document.querySelectorAll('.reveal-up, .reveal-text').forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    var els = gsap.utils.toArray('.reveal-up, .reveal-text');
    // starting state, set once via GSAP so it can smoothly tween from here
    gsap.set(els, { opacity: 0, y: 30 });

    ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: false,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          stagger: 0.12, overwrite: 'auto'
        });
      },
      onLeave: function (batch) {
        gsap.to(batch, {
          opacity: 0, y: -24, duration: 0.5, ease: 'power2.in',
          stagger: 0.05, overwrite: 'auto'
        });
      },
      onEnterBack: function (batch) {
        gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          stagger: 0.12, overwrite: 'auto'
        });
      },
      onLeaveBack: function (batch) {
        gsap.to(batch, {
          opacity: 0, y: 30, duration: 0.5, ease: 'power2.in',
          stagger: 0.05, overwrite: 'auto'
        });
      }
    });

    // roadmap fill + active node highlighting
    var roadmap = document.getElementById('roadmap');
    var fill = document.getElementById('roadmapFill');
    if (roadmap && fill) {
      ScrollTrigger.create({
        trigger: roadmap,
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.4,
        onUpdate: function (self) {
          fill.style.height = (self.progress * 100) + '%';
        }
      });
      document.querySelectorAll('.cert-card').forEach(function (card) {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 75%',
          onEnter: function () { card.classList.add('active'); },
          onLeaveBack: function () { card.classList.remove('active'); }
        });
      });
    }

    // hero entrance
    gsap.from('.hero-title, .hero-role, .hero-desc, .hero-actions, .hero-social', {
      y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.15
    });
    gsap.from('.hero-photo-wrap', { x: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.25 });
  })();

  /* ============================================================
     CERTIFICATE MODAL
     ============================================================ */
  (function certModal() {
    var certData = {
      intro_to_cybersecurity: { title: 'Introduction to Cybersecurity — Cisco Networking Academy', img: 'assets/certs/intro_to_cybersecurity.jpg' },
      os_basics: { title: 'Operating Systems Basics — Cisco Networking Academy', img: 'assets/certs/os_basics.jpg' },
      linux: { title: 'Linux System Administrator — The Digital Adda', img: 'assets/certs/linux.jpg' },
      networking_cybrary: { title: 'Network Basics — Cybrary', img: 'assets/certs/networking_cybrary.jpg' },
      ccna: { title: 'CCNA — Routing & Switching — The Digital Adda', img: 'assets/certs/ccna.jpg' },
      dark_web: { title: 'Introduction to Dark Web, Anonymity & Cryptocurrency — CodeRed', img: 'assets/certs/dark_web.jpg' },
      sql_injection: { title: 'SQL Injection Attacks — CodeRed', img: 'assets/certs/sql_injection.jpg' },
      deloitte_simultion: { title: 'Cyber Job Simulation — Deloitte (Forage)', img: 'assets/certs/deloitte_simultion.jpg' },
      tech_hierarchy: { title: 'Certificate of Internship — Tech Hierarchy', img: 'assets/certs/tech_hierarchy_internship.jpg' },
      secure_dev_labs: { title: 'Ethical Hacking Internship — Secure Dev Labs', img: 'assets/certs/dev_secure_labs_internship.jpg' }
    };

    var modal = document.getElementById('certModal');
    var img = document.getElementById('certModalImg');
    var titleEl = document.getElementById('certModalTitle');
    var closeBtn = document.getElementById('certModalClose');
    var backdrop = document.getElementById('certModalBackdrop');
    var lastFocused = null;

    function openModal(key) {
      var data = certData[key];
      if (!data) return;
      lastFocused = document.activeElement;
      img.src = data.img;
      img.alt = data.title + ' certificate';
      titleEl.textContent = data.title;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('[data-cert]').forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(btn.getAttribute('data-cert')); });
    });
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  })();

  /* ============================================================
     CONTACT FORM — real-time validation + live email delivery
     via FormSubmit (no backend/API key required)
     ============================================================ */
  (function contactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var note = document.getElementById('formNote');
    var submitBtn = document.getElementById('cfSubmitBtn');
    var submitLabel = submitBtn ? submitBtn.querySelector('span') : null;
    var defaultNote = note ? note.textContent : '';

    var fields = {
      name: {
        el: form.elements['name'],
        validate: function (v) {
          return v.trim().length >= 2 ? '' : 'Please enter your name.';
        }
      },
      email: {
        el: form.elements['email'],
        validate: function (v) {
          var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return re.test(v.trim()) ? '' : 'Please enter a valid email address.';
        }
      },
      message: {
        el: form.elements['message'],
        validate: function (v) {
          var len = v.trim().length;
          if (len < 10) return 'Message should be at least 10 characters.';
          if (len > 2000) return 'Message is too long.';
          return '';
        }
      }
    };

    function showError(key, msg) {
      var errEl = document.getElementById('err-' + key);
      if (errEl) errEl.textContent = msg;
      if (fields[key] && fields[key].el) fields[key].el.classList.toggle('invalid', !!msg);
    }

    // live validation: only start nagging a field once the user has left it once
    Object.keys(fields).forEach(function (key) {
      var f = fields[key];
      if (!f.el) return;
      var touched = false;
      f.el.addEventListener('blur', function () {
        touched = true;
        showError(key, f.validate(f.el.value));
      });
      f.el.addEventListener('input', function () {
        if (touched) showError(key, f.validate(f.el.value));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // honeypot — real users never fill this hidden field
      var honey = form.elements['_honey'];
      if (honey && honey.value) return;

      var valid = true;
      Object.keys(fields).forEach(function (key) {
        var msg = fields[key].validate(fields[key].el.value);
        showError(key, msg);
        if (msg) valid = false;
      });
      if (!valid) {
        if (note) { note.textContent = 'Please fix the highlighted fields above.'; }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = 'Sending…';
      if (note) note.textContent = 'Sending your message…';

      var formData = new FormData(form);

      fetch('https://formsubmit.co/ajax/hashir10578@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed with status ' + res.status);
          return res.json();
        })
        .then(function () {
          if (note) note.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
          form.reset();
          Object.keys(fields).forEach(function (key) { showError(key, ''); });
        })
        .catch(function () {
          if (note) {
            note.innerHTML = 'Something went wrong sending that automatically. Please email me directly at <a href="mailto:hashir10578@gmail.com">hashir10578@gmail.com</a>.';
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (submitLabel) submitLabel.textContent = 'Send message';
        });
    });
  })();

  /* ============================================================
     CONTENT PROTECTION (deterrence, not a guarantee)
     ============================================================ */
  (function protectContent() {
    document.querySelectorAll('.protected-media').forEach(function (el) {
      el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      el.addEventListener('dragstart', function (e) { e.preventDefault(); });
    });
  })();

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  document.getElementById('footerYear').textContent = new Date().getFullYear();

})();