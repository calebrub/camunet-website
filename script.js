const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const year = document.querySelector("[data-year]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navMenu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const contact = (data.get("contact") || "").toString().trim();
  const service = (data.get("service") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();

  const waText = `Hello CAMUNET-SMC Uganda,\nMy name is ${name}.\nI am inquiring about: ${service}.\nMessage: ${message}\nContact: ${contact}`;
  const waUrl = `https://wa.me/256775549639?text=${encodeURIComponent(waText)}`;

  formStatus.innerHTML = `Connecting you to our engineering desk on WhatsApp... If it didn't open automatically, <a href="${waUrl}" target="_blank" rel="noreferrer" style="color: var(--red); text-decoration: underline; font-weight: bold;">click here to chat</a> or email us at <a href="mailto:camunet2000@gmail.com" style="color: var(--red); text-decoration: underline;">camunet2000@gmail.com</a>.`;

  window.open(waUrl, "_blank", "noopener,noreferrer");
  form.reset();
});

year.textContent = new Date().getFullYear();

// Gallery Filtering & Lightbox
const filterBtns = document.querySelectorAll(".filter-btn");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.getElementById("gallery-lightbox");
const lightboxImg = document.querySelector("[data-lightbox-img]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxCloseBtns = document.querySelectorAll("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");

let visibleItems = [...galleryItems];
let currentLightboxIndex = 0;

const updateVisibleItems = () => {
  visibleItems = galleryItems.filter(item => item.style.display !== "none");
};

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filterValue = btn.getAttribute("data-filter");

    galleryItems.forEach(item => {
      const match = filterValue === "all" || item.getAttribute("data-category") === filterValue;
      if (match) {
        item.style.display = "";
        requestAnimationFrame(() => {
          item.style.opacity = "1";
        });
      } else {
        item.style.opacity = "0";
        setTimeout(() => {
          if (item.style.opacity === "0") {
            item.style.display = "none";
            updateVisibleItems();
          }
        }, 250);
      }
    });

    setTimeout(updateVisibleItems, 260);
  });
});

const openLightbox = (index) => {
  updateVisibleItems();
  if (!visibleItems.length) return;
  currentLightboxIndex = (index + visibleItems.length) % visibleItems.length;
  const currentItem = visibleItems[currentLightboxIndex];
  const img = currentItem.querySelector("img");
  const caption = currentItem.querySelector("figcaption");

  if (img && lightboxImg) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
  }
  if (caption && lightboxCaption) {
    lightboxCaption.textContent = caption.textContent;
  }

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const showNextImage = () => {
  if (visibleItems.length <= 1) return;
  openLightbox(currentLightboxIndex + 1);
};

const showPrevImage = () => {
  if (visibleItems.length <= 1) return;
  openLightbox(currentLightboxIndex - 1);
};

// Open lightbox on gallery item click / Enter key
galleryItems.forEach(item => {
  item.addEventListener("click", () => {
    updateVisibleItems();
    const idx = visibleItems.indexOf(item);
    if (idx !== -1) openLightbox(idx);
  });

  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      updateVisibleItems();
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    }
  });
});

// Close buttons & overlay click
lightboxCloseBtns.forEach(btn => btn.addEventListener("click", closeLightbox));

// Nav buttons
if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); showPrevImage(); });
if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); showNextImage(); });

// Keyboard controls (Esc, ArrowLeft, ArrowRight)
window.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowRight") {
    showNextImage();
  } else if (e.key === "ArrowLeft") {
    showPrevImage();
  }
});
