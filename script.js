const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

document.documentElement.classList.add("js-ready");

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "เปิดเมนู");
    navigation.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "เปิดเมนู" : "ปิดเมนู");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const siteHeader = document.querySelector(".site-header");
const progressBar = document.querySelector(".page-progress span");
let scrollTicking = false;

const updateScrollUI = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;

  if (progressBar instanceof HTMLElement) {
    progressBar.style.width = `${progress * 100}%`;
  }

  if (siteHeader) {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  scrollTicking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollUI);
      scrollTicking = true;
    }
  },
  { passive: true },
);

updateScrollUI();

const serviceItems = [...document.querySelectorAll(".service-item[data-image]")];
const serviceVisual = document.querySelector(".service-visual");
const servicePreviewImage = document.querySelector("#service-preview-image");
const servicePreviewLabel = document.querySelector("#service-preview-label");
const servicePreviewTitle = document.querySelector("#service-preview-title");
let serviceSwapTimer;

const activateService = (item) => {
  if (!(item instanceof HTMLElement) || item.classList.contains("is-active")) return;

  serviceItems.forEach((candidate) => candidate.classList.toggle("is-active", candidate === item));
  serviceVisual?.classList.add("is-changing");
  window.clearTimeout(serviceSwapTimer);
  serviceSwapTimer = window.setTimeout(() => {
    if (servicePreviewImage instanceof HTMLImageElement && item.dataset.image) {
      servicePreviewImage.src = item.dataset.image;
    }

    if (servicePreviewLabel) {
      const number = item.querySelector(".service-number")?.textContent?.trim() ?? "";
      servicePreviewLabel.textContent = `${number} / ${item.dataset.label ?? ""}`;
    }

    if (servicePreviewTitle) {
      servicePreviewTitle.textContent = item.dataset.title ?? "";
    }

    serviceVisual?.classList.remove("is-changing");
  }, 140);
};

serviceItems.forEach((item) => {
  item.addEventListener("pointerenter", () => activateService(item));
  item.addEventListener("focus", () => activateService(item));
});

const revealItems = document.querySelectorAll(
  ".section-heading, .intro-copy, .about-showcase, .promise-strip, .service-item, .service-visual, .workflow-steps, .project-card, .contact-details",
);

revealItems.forEach((item) => item.classList.add("reveal-item"));

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
