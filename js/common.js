document.addEventListener("DOMContentLoaded", function () {
  'use strict';

  /* =======================================================
  // Analytics
  ======================================================= */
  const ANALYTICS_URL = "https://5x2xylkpxj.execute-api.us-east-1.amazonaws.com/prod/view_analytics";

  // Shared helper: sends one analytics event and never throws.
  // keepalive lets the request finish even if the page navigates away.
  function trackEvent(payload) {
    return fetch(ANALYTICS_URL, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(error => {
      console.error("Analytics tracking failed:", error);
    });
  }

  // Page view
  trackEvent({ page: window.location.pathname });

  // Resume download
  const resume = document.getElementById("resume-download");
  if (resume) {
    resume.addEventListener("click", () => {
      trackEvent({ page: "resume" });
    });
  }

  // GitHub link clicks (any link to github.com on any page)
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href*="github.com"]');
    if (!link) return;

    trackEvent({
      page: "github_click:" + window.location.pathname,
      link: link.href
    });
  });


  /* =======================================================
  // Contact Form
  ======================================================= */
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("form-name").value;
      const email = document.getElementById("form-email").value;
      const message = document.getElementById("form-text").value;

      try {
        const response = await fetch(
          "https://5x2xylkpxj.execute-api.us-east-1.amazonaws.com/prod/form_submit",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
          }
        );

        if (response.ok) {
          contactForm.reset();
        } else {
          console.error("Form submit failed with status:", response.status);
        }
      } catch (error) {
        console.error("Form submit failed:", error);
      }
    });
  }


  /* =======================================================
  // Menu + Theme Switcher
  ======================================================= */
  const html = document.querySelector("html"),
    menuOpenIcon = document.querySelector(".icon__menu"),
    menuCloseIcon = document.querySelector(".nav__icon-close"),
    menuList = document.querySelector(".main-nav"),
    toggleTheme = document.querySelector(".toggle-theme-js"),
    btnScrollToTop = document.querySelector(".top");

  if (menuOpenIcon && menuList) {
    menuOpenIcon.addEventListener("click", () => {
      menuList.classList.add("is-open");
    });
  }

  if (menuCloseIcon && menuList) {
    menuCloseIcon.addEventListener("click", () => {
      menuList.classList.remove("is-open");
    });
  }

  function darkMode() {
    if (html.classList.contains("dark-mode")) {
      html.classList.remove("dark-mode");
      localStorage.removeItem("theme");
      document.documentElement.removeAttribute("dark");
    } else {
      html.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("dark", "");
    }
  }


  /* ================================================================
  // Stop Animations During Window Resizing and Switching Theme Modes
  ================================================================ */
  let disableTransition;

  function stopAnimation() {
    document.body.classList.add("disable-animation");
    clearTimeout(disableTransition);
    disableTransition = setTimeout(() => {
      document.body.classList.remove("disable-animation");
    }, 100);
  }

  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      darkMode();
      stopAnimation();
    });

    window.addEventListener("resize", stopAnimation);
  }


  /* =======================
  // Responsive Videos
  ======================= */
  if (typeof reframe === "function") {
    reframe(".post__content iframe:not(.reframe-off), .page__content iframe:not(.reframe-off), .project-content iframe:not(.reframe-off)");
  }


  /* =======================
  // LazyLoad Images
  ======================= */
  if (typeof LazyLoad === "function") {
    new LazyLoad({ elements_selector: ".lazy" });
  }


  /* =======================
  // Zoom Image
  ======================= */
  const lightense = document.querySelector(".page__content img, .post__content img, .project-content img, .gallery__image img"),
    imageLinks = document.querySelectorAll(".page__content a img, .post__content a img, .project-content a img, .gallery__image a img");

  imageLinks.forEach(img => {
    img.parentNode.classList.add("image-link");
    img.classList.add("no-lightense");
  });

  if (lightense && typeof Lightense === "function") {
    Lightense(".page__content img:not(.no-lightense), .post__content img:not(.no-lightense), .project-content img:not(.no-lightense), .gallery__image img:not(.no-lightense)", {
      padding: 60,
      offset: 30
    });
  }


  /* ============================
  // Testimonials Slider
  ============================ */
  if (document.querySelector(".my-slider") && typeof tns === "function") {
    tns({
      container: ".my-slider",
      items: 3,
      slideBy: 1,
      gutter: 32,
      nav: true,
      mouseDrag: true,
      autoplay: false,
      controls: false,
      speed: 500,
      responsive: {
        1024: { items: 3 },
        768: { items: 2 },
        0: { items: 1 }
      }
    });
  }


  /* =================================
  // Smooth scroll to the tags page
  ================================= */
  document.querySelectorAll(".tag__link, .top__link").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });


  /* =======================
  // Scroll Top Button
  ======================= */
  if (btnScrollToTop) {
    btnScrollToTop.addEventListener("click", () => {
      if (window.scrollY !== 0) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    });
  }
});