const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll(".reveal");
const timeline = document.querySelector(".timeline");
const projectCards = document.querySelectorAll(".project-card");
const navLinks = document.querySelectorAll(".nav-links a");
const sectionTargets = document.querySelectorAll("section[id]");
const magneticButtons = document.querySelectorAll(".hero-actions .button");

const setActiveNav = (sectionId) => {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${sectionId}`);
  });
};

const updateActiveNav = () => {
  const scrollPosition = window.scrollY + window.innerHeight * 0.42;
  let activeSectionId = sectionTargets[0]?.id;

  sectionTargets.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      activeSectionId = section.id;
    }
  });

  const bottomThreshold = 3;
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - bottomThreshold) {
    activeSectionId = sectionTargets[sectionTargets.length - 1]?.id;
  }

  if (activeSectionId) {
    setActiveNav(activeSectionId);
  }
};

const resetMagneticButton = (button) => {
  button.style.setProperty("--move-x", "0px");
  button.style.setProperty("--move-y", "0px");
};

if ("IntersectionObserver" in window) {
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
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  if (timeline) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-drawn");
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.18,
      },
    );

    timelineObserver.observe(timeline);
  }

  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("resize", updateActiveNav);
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));

  if (timeline) {
    timeline.classList.add("is-drawn");
  }

  updateActiveNav();
}

projectCards.forEach((card) => {
  card.querySelectorAll(".project-meta span").forEach((tag, index) => {
    tag.style.setProperty("--tag-index", index);
  });

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--spotlight-x", `${x}px`);
    card.style.setProperty("--spotlight-y", `${y}px`);
  });
});

magneticButtons.forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.setProperty("--move-x", `${x * 0.08}px`);
    button.style.setProperty("--move-y", `${y * 0.12}px`);
  });

  button.addEventListener("pointerleave", () => resetMagneticButton(button));
  button.addEventListener("blur", () => resetMagneticButton(button));
});
