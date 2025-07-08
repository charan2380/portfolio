document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const body = document.body;
  const themeToggle = document.querySelector(".theme-toggle i");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const resumeBtn = document.getElementById("resume-btn");
  const modal = document.getElementById("resume-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const downloadBtn = document.getElementById("download-resume");
  const submitBtn = document.getElementById("submit-btn");
  const formMsg = document.getElementById("form-message");
  const resumeUrl = "https://charan2380.github.io/portfolio/Resume.pdf";

  // Theme toggle
  document.querySelector(".theme-toggle").addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const icon = themeToggle;
    if (body.classList.contains("light-mode")) {
      icon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "dark");
    }
    gsap.from(".navbar", { y: -20, opacity: 0, duration: 0.5 });
  });

  // Hamburger menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    if (navLinks.classList.contains("active")) {
      gsap.from(".nav-links a, .nav-links button", {
        y: 20, opacity: 0, duration: 0.5, stagger: 0.1
      });
    }
  });

  navLinks.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Modal control
  resumeBtn.addEventListener("click", () => {
    modal.classList.add("active");
    gsap.from(".modal-content", { scale: 0.8, opacity: 0, duration:0.5, ease:"back.out(1.7)" });
  });
  closeModalBtn.addEventListener("click", hideModal);
  function hideModal() {
    gsap.to(".modal-content", { scale:0.8, opacity:0, duration:0.3, onComplete: () => modal.classList.remove("active") });
  }
  downloadBtn.addEventListener("click", () => window.open(resumeUrl, "_blank"));
  window.addEventListener("keydown", e => { if(e.key === "Escape") hideModal(); });

  // Form submission
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const desc = document.getElementById("description").value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !desc || !regex.test(email)) {
      formMsg.textContent = !regex.test(email) ? "Enter a valid email!" : "Please fill all fields!";
      formMsg.className = "error";
      animateMsg();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    fetch("https://usebasin.com/f/4d11e7aedff8", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, description: desc })
    })
    .then(res => res.ok ? showResult(true) : showResult(false))
    .catch(() => showResult(false));
  });

  function showResult(success) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit';
    formMsg.textContent = success ? "Message sent successfully!" : "Failed to send. Try again.";
    formMsg.className = success ? "success" : "error";
    if (success) ["name","email","description"].forEach(id => document.getElementById(id).value = "");
    animateMsg();
  }

  function animateMsg() {
    gsap.from(formMsg, { y: 10, opacity: 0, duration: 0.5 });
    setTimeout(() => formMsg.textContent = "", 3000);
  }

  // Certifications toggle
  document.querySelectorAll(".certification-card").forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      img.classList.toggle("visible");
      gsap.fromTo(img, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
    });
  });

  // Scroll animations
  const animEls = [
    { sel: ".nav-links a, .nav-links button, .theme-toggle", opt: { y: -20 }},
    { sel: ".hero-image img", opt: { scale: 0, ease:"elastic.out(1,0.3)" }},
    { sel: ".hero-text h1", opt: { x: -100 }},
    { sel: ".hero-text p", opt: { x: -100 }},
    { sel: ".skills-card", opt: { x: 100 }},
    { sel: ".skill-item", opt: { y: 20 }}
  ];
  animEls.forEach((g, idx) => {
    gsap.from(g.sel, {
      ...g.opt, opacity: 0, duration: 0.8, delay: idx * 0.2, ease: "power3.out"
    });
  });

  ["#about", "#projects", "#certifications", "#contact"].forEach(from => {
    gsap.utils.toArray(`${from} h2`).forEach(el => {
      gsap.from(el, { y: 50, opacity:0, scrollTrigger:{ trigger: el, start: "top 80%" }, duration:1, ease: "power3.out"});
    });
  });
  const staggerGroup = [
    ".project-card", ".certification-card", ".contact-item", ".contact-form input, .contact-form textarea, .contact-form button"
  ];
  staggerGroup.forEach(sel => {
    gsap.from(sel, {
      y: 50, opacity: 0, duration:0.8, stagger:0.2,
      scrollTrigger: { trigger: sel, start: "top 85%" }
    });
  });

  // Hover scale reuse
  function applyHover(elms, scale=1.05){
    elms.forEach(el => {
      el.addEventListener("mouseenter", () => gsap.to(el, { scale, duration:0.3 }));
      el.addEventListener("mouseleave", () => gsap.to(el, { scale:1, duration:0.3 }));
    });
  }
  applyHover([...document.querySelectorAll(".project-card, .certification-card, .contact-item"), document.querySelector(".theme-toggle")]);
});
