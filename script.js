const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = document.querySelectorAll('a[href^="#"]');
const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const form = document.getElementById("order-form");
const formStatus = document.getElementById("form-status");
const year = document.getElementById("year");
const revealItems = document.querySelectorAll("[data-reveal]");
const heroSection = document.querySelector(".hero-section");
const parallaxCard = document.querySelector(".parallax-card");
const particleCanvas = document.getElementById("ice-particles");

body.classList.add("is-loaded");
year.textContent = new Date().getFullYear();

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();

const closeMobileMenu = () => {
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("is-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
});

dropdownToggle?.addEventListener("click", () => {
  const expanded = dropdownToggle.getAttribute("aria-expanded") === "true";
  dropdownToggle.setAttribute("aria-expanded", String(!expanded));
  dropdown.classList.toggle("is-open", !expanded);
});

document.addEventListener("click", (event) => {
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.classList.remove("is-open");
    dropdownToggle?.setAttribute("aria-expanded", "false");
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();

    // Close menu FIRST, then scroll after layout settles
    if (mobileMenu.classList.contains("is-open")) {
      closeMobileMenu();
    }

    setTimeout(() => {
      const offset = header.offsetHeight + 16;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
    }, 300);

  });
});
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const applyParallax = () => {
  if (!heroSection || !parallaxCard) {
    return;
  }

  const rect = heroSection.getBoundingClientRect();
  const progress = Math.max(-1, Math.min(1, rect.top / rect.height));
  parallaxCard.style.transform = `translateY(${progress * -24}px)`;
};

const handleScroll = () => {
  setHeaderState();
  applyParallax();
};

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });
window.addEventListener("resize", applyParallax);
applyParallax();


if (particleCanvas) {
  const context = particleCanvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let particles = [];
  let animationFrame = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;

  const createParticle = () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius: Math.random() * 2.4 + 0.8,
    speedY: Math.random() * 0.35 + 0.08,
    speedX: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.55 + 0.12
  });

  const resizeCanvas = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = particleCanvas.offsetWidth;
    canvasHeight = particleCanvas.offsetHeight;
    particleCanvas.width = canvasWidth * scale;
    particleCanvas.height = canvasHeight * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);

    const targetCount = Math.max(36, Math.floor(canvasWidth / 28));
    particles = Array.from({ length: targetCount }, createParticle);
  };


  const renderParticles = () => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.beginPath(); // ONE beginPath for all particles

  particles.forEach((particle) => {
    particle.y += particle.speedY;
    particle.x += particle.speedX;

    if (particle.y > canvasHeight + 12) { particle.y = -12; particle.x = Math.random() * canvasWidth; }
    if (particle.x > canvasWidth + 12) { particle.x = -12; }
    if (particle.x < -12) { particle.x = canvasWidth + 12; }

    context.moveTo(particle.x + particle.radius, particle.y);
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
  });

  context.fillStyle = "rgba(212, 243, 255, 0.35)"; // One fill call
  context.fill();

  animationFrame = window.requestAnimationFrame(renderParticles);
};
  

  const introVideo = document.getElementById("introVideo");
  if (introVideo) {
    introVideo.muted = true; // Ensure muted is set via JS too (Safari requirement)
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
       // Autoplay was blocked — retry on first user interaction
       document.addEventListener("click", () => introVideo.play(), { once: true });
        document.addEventListener("touchstart", () => introVideo.play(), { once: true });
      });
    }
  }
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("order-form");
  const formStatus = document.getElementById("form-status");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.querySelector('input[name="name"]')?.value || "";
    const email = document.querySelector('input[name="email"]')?.value || "";
    const message = document.querySelector('textarea[name="message"]')?.value || "";

    // ✔ Turkish thank you message
    formStatus.textContent =
      `Teşekkürler${name ? `, ${name}` : ""}. Talebiniz alınmıştır ve ekibimiz en kısa sürede sizinle iletişime geçecektir.`;

    // WhatsApp message
    const text =
`Merhaba, sipariş vermek istiyorum:

Ad Soyad: ${name}
E-posta: ${email}

Mesaj:
${message}`;

    const phone = "905319049161";
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);

    // small delay so user sees message first
    setTimeout(() => {
      window.open(url, "_blank");
      form.reset();
    }, 800);
  });
});

}
