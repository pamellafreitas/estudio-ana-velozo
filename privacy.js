(() => {
  "use strict";
  const key = "ana-velozo-map-consent-v1",
    maxAge = 180 * 24 * 60 * 60 * 1000;
  let choice = null;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved.maps === "boolean" && Date.now() - saved.at < maxAge) choice = saved.maps;
  } catch {}
  const banner = document.getElementById("privacy-banner"),
    settings = document.getElementById("privacy-settings"),
    check = document.getElementById("privacy-maps");
  const placeholders = [...document.querySelectorAll("[data-map-placeholder]")];
  function apply() {
    document.querySelectorAll("iframe[data-map-src]").forEach((frame) => {
      if (choice === true) {
        frame.src = frame.dataset.mapSrc;
        frame.hidden = false;
      } else {
        frame.removeAttribute("src");
        frame.hidden = true;
      }
    });
    placeholders.forEach((p) => (p.hidden = choice === true));
    if (banner) banner.hidden = choice !== null;
  }
  function save(value) {
    choice = value;
    try {
      localStorage.setItem(key, JSON.stringify({ maps: value, at: Date.now() }));
    } catch {}
    apply();
  }
  document.querySelectorAll("[data-privacy-accept]").forEach((b) => b.addEventListener("click", () => save(true)));
  document.querySelectorAll("[data-privacy-reject]").forEach((b) =>
    b.addEventListener("click", () => {
      save(false);
      if (settings.open) settings.close();
    }),
  );
  document.querySelectorAll("[data-privacy-open]").forEach((b) =>
    b.addEventListener("click", () => {
      check.checked = choice === true;
      settings.showModal();
    }),
  );
  document.querySelectorAll("[data-map-allow]").forEach((b) => b.addEventListener("click", () => save(true)));
  document.getElementById("privacy-save").addEventListener("click", () => {
    save(check.checked);
    settings.close();
  });
  document.getElementById("privacy-close").addEventListener("click", () => settings.close());
  apply();
})();
