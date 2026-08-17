// VFW Post 4093 — shared behavior. No framework, no build step.

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Charter expand/collapse: adjust chevron via [open] handled in CSS already;
  // nothing extra needed here since <details> is native.

  // Formspree submissions: submit via fetch so the confirmation shows inline
  // instead of redirecting to a Formspree-hosted page. Success copy is
  // authored per-page in the HTML; only the error fallback is set here.
  document.querySelectorAll("form[data-ajax-form]").forEach((form) => {
    const status = form.parentElement.querySelector("[data-form-status]");
    const statusText = status?.querySelector("[data-form-status-text]");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Form submission failed");
        form.hidden = true;
        status.hidden = false;
        status.classList.remove("form-status--error");
      } catch (err) {
        status.hidden = false;
        status.classList.add("form-status--error");
        statusText.textContent = "Something went wrong sending that. Please call us instead at 734-654-9216.";
      } finally {
        submitBtn.disabled = false;
      }
    });
  });
});
