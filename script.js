"use strict";

// Garante que o navegador exiba sempre URLs limpas sem .html ou index.html
if (window.history && window.history.replaceState && window.location.protocol.startsWith("http")) {
  let path = window.location.pathname;
  if (path.endsWith("/index.html")) {
    path = path.slice(0, -10);
    window.history.replaceState(null, "", path + window.location.search + window.location.hash);
  } else if (path.endsWith(".html")) {
    path = path.slice(0, -5) + "/";
    window.history.replaceState(null, "", path + window.location.search + window.location.hash);
  }
}

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const dropdown = document.querySelector(".dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");
function closeMenu() {
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  dropdown.classList.remove("open");
  dropdownToggle.setAttribute("aria-expanded", "false");
}
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menu.classList.toggle("is-open", !expanded);
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
});
dropdownToggle.addEventListener("click", () => {
  const expanded = dropdownToggle.getAttribute("aria-expanded") === "true";
  dropdown.classList.toggle("open", !expanded);
  dropdownToggle.setAttribute("aria-expanded", String(!expanded));
});
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target)) {
    dropdown.classList.remove("open");
    dropdownToggle.setAttribute("aria-expanded", "false");
  }
  if (!menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const wasOpen = menu.classList.contains("is-open");
    closeMenu();
    if (wasOpen) menuToggle.focus();
  }
});
matchMedia("(min-width: 821px)").addEventListener("change", closeMenu);
document.querySelector("#year").textContent = new Date().getFullYear();
const dialog = document.querySelector("#modality-dialog");
let dialogTrigger;
document.querySelectorAll(".modality-link").forEach((button) => {
  button.addEventListener("click", () => {
    dialogTrigger = button;
    const name = button.dataset.modality;
    const description = button.closest("article").querySelector("p:not(.eyebrow)").textContent;
    document.querySelector("#dialog-title").textContent = name;
    document.querySelector("#dialog-description").textContent = description;
    document.querySelector("#dialog-whatsapp").href =
      "https://wa.me/5521985526176?text=" +
      encodeURIComponent("Olá! Quero conhecer as aulas de " + name + " e agendar uma aula experimental gratuita.");
    dialog.showModal();
    document.body.classList.add("modal-open");
  });
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (
    event.target === dialog &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  )
    dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  dialogTrigger?.focus();
});

// O conteúdo permanece visível sem JavaScript e para quem reduz movimentos.
(() => {
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  if (motionPreference.matches || !("IntersectionObserver" in window)) return;
  const targets = document.querySelectorAll(
    [
      ".section-heading",
      ".center-heading",
      ".course",
      ".age-grid > article",
      ".teaching-grid > div:first-child",
      ".principles > article",
      ".about > div",
      ".about-photo",
      ".gallery-photo",
      ".review-rating",
      ".review-card",
      ".google-reviews-link",
      ".blog-status",
      ".location-grid > div",
      ".final-cta > .container",
    ].join(", "),
  );
  let observer;
  try {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -35px 0px" },
    );
    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) return;
      if (rect.bottom <= 0) return;
      target.classList.add("scroll-reveal");
      observer.observe(target);
    });
    motionPreference.addEventListener("change", (event) => {
      if (event.matches) {
        observer.disconnect();
        targets.forEach((target) => target.classList.add("is-visible"));
      }
    });
  } catch {
    observer?.disconnect();
    targets.forEach((target) => target.classList.add("is-visible"));
  }
})();
