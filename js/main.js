const WHATSAPP_NUMBER = "919897418957";

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }

  const enquiryForm = document.getElementById("enquiry-form");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(enquiryForm);
      const name = data.get("name") || "";
      const phone = data.get("phone") || "";
      const checkin = data.get("checkin") || "";
      const checkout = data.get("checkout") || "";
      const guests = data.get("guests") || "";
      const room = data.get("room") || "";
      const message = data.get("message") || "";

      const lines = [
        `Hi, I'd like to enquire about a stay at The Central House.`,
        `Name: ${name}`,
        phone ? `Phone: ${phone}` : "",
        room ? `Room: ${room}` : "",
        checkin ? `Check-in: ${checkin}` : "",
        checkout ? `Check-out: ${checkout}` : "",
        guests ? `Guests: ${guests}` : "",
        message ? `Message: ${message}` : "",
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join("\n"));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    });
  }

  document.querySelectorAll("[data-room-enquire]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const room = btn.getAttribute("data-room-enquire");
      const text = encodeURIComponent(
        `Hi, I'd like to enquire about the ${room} at The Central House. Could you share availability and rates?`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    });
  });

  initHeroSlider();
  initRoomSliders();
  initScrollReveal();
});

function initRoomSliders() {
  document.querySelectorAll("[data-room-slider]").forEach((el) => {
    const slides = Array.from(el.querySelectorAll(".slide"));
    if (slides.length < 2) return;

    const dots = Array.from(el.querySelectorAll(".room-slider-dots button"));
    let active = 0;

    const goTo = (index) => {
      slides[active].classList.remove("is-active");
      dots[active] && dots[active].classList.remove("is-active");
      active = (index + slides.length) % slides.length;
      slides[active].classList.add("is-active");
      dots[active] && dots[active].classList.add("is-active");
    };

    let timer = setInterval(() => goTo(active + 1), 5000);
    const restartTimer = () => {
      clearInterval(timer);
      timer = setInterval(() => goTo(active + 1), 5000);
    };

    const prev = el.querySelector(".room-slider-arrow.prev");
    const next = el.querySelector(".room-slider-arrow.next");
    prev && prev.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      goTo(active - 1);
      restartTimer();
    });
    next && next.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      goTo(active + 1);
      restartTimer();
    });
    dots.forEach((dot, i) => dot.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      goTo(i);
      restartTimer();
    }));
  });
}

function initHeroSlider() {
  const hero = document.querySelector("[data-hero-slider]");
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll(".hero-slide"));
  const dots = Array.from(hero.querySelectorAll(".hero-dots button"));
  const grid = hero.querySelector("[data-hero-grid]");
  if (slides.length < 2) return;

  const WIPE_MS = 700;
  // Slide 0 and dot 0 are already marked active in the HTML, and the
  // grid starts already hidden — so the very first paint needs no
  // JS-timed reveal at all (nothing to desync or throttle on load).
  let active = 0;
  let animating = false;

  const swapSlide = (index) => {
    slides[active].classList.remove("is-active");
    dots[active] && dots[active].classList.remove("is-active");
    active = index;
    slides[active].classList.add("is-active");
    dots[active] && dots[active].classList.add("is-active");
  };

  // Grid-wipe transition: tiles fade in to cover the current slide,
  // the slide swaps underneath while hidden, then tiles fade out in
  // the same staggered wave to reveal the new slide. visibility is
  // toggled alongside the opacity class as a hard guarantee — some
  // engines keep compositing a "opacity: 0" grid of many tiles over
  // a transformed sibling, so opacity alone isn't reliably invisible.
  const revealSlide = () => {
    grid.classList.add("is-hidden");
    setTimeout(() => {
      grid.style.visibility = "hidden";
      animating = false;
    }, WIPE_MS);
  };

  const goTo = (index) => {
    if (animating || index === active) return;
    animating = true;

    grid.style.visibility = "visible";
    grid.classList.remove("is-hidden");
    setTimeout(() => {
      swapSlide(index);
      setTimeout(revealSlide, 30);
    }, WIPE_MS);
  };

  dots.forEach((dot, i) => dot.addEventListener("click", () => {
    clearInterval(timer);
    goTo(i);
    timer = setInterval(() => goTo((active + 1) % slides.length), 6000);
  }));

  let timer = setInterval(() => goTo((active + 1) % slides.length), 6000);
}

function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => observer.observe(el));
}
