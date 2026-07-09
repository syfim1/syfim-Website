document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.textContent = isOpen ? "✕" : "☰";
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#name")?.value || "";
      const email = form.querySelector("#email")?.value || "";
      const message = form.querySelector("#message")?.value || "";
      const subject = encodeURIComponent("Anfrage über syfim.de");
      const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\n${message}`);
      window.location.href = `mailto:info@syfim.com?subject=${subject}&body=${body}`;
    });
  }

  const langLinks = document.querySelectorAll(".lang-switch a[href]");
  if (langLinks.length && window.location.hash) {
    langLinks.forEach((a) => {
      const base = a.getAttribute("href").split("#")[0];
      a.setAttribute("href", base + window.location.hash);
    });
  }
});
