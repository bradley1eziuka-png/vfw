// VFW Post 4093 — shared behavior. No framework, no build step.

// Single source of truth for Thursday Bingo facts that are quoted on more
// than one page (Home's "this week" strip, Home's events preview, the full
// Events page). Update the two strings below and every [data-bingo-*] spot
// on the site picks up the change automatically — no more hunting down each
// hand-written copy. Static text left inside those spans in the HTML is
// just a same-content fallback for the rare case JS doesn't run.
const BINGO_HOURS = "Doors open 4pm. Bingo begins 6pm, runs to 10pm.";
const BINGO_FOOD_POLICY = "Kitchen food available; outside food isn't permitted.";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-bingo-hours]").forEach((el) => {
    el.textContent = BINGO_HOURS;
  });
  document.querySelectorAll("[data-bingo-food]").forEach((el) => {
    el.textContent = BINGO_FOOD_POLICY;
  });

  // "Next up" date on Home's this-week strip: computed instead of
  // hand-typed, so it can't go stale the way a hardcoded date did.
  const nextBingoEl = document.querySelector("[data-next-bingo]");
  if (nextBingoEl) {
    const today = new Date();
    const daysUntilThursday = (4 - today.getDay() + 7) % 7;
    const next = new Date(today);
    next.setDate(today.getDate() + daysUntilThursday);
    nextBingoEl.textContent = next.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

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
