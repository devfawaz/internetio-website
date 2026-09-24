// Model chips marquee — duplicated once so the loop is seamless
const MODELS = [
  { name: "Open AI", model: "gpt-4o", icon: "openai.svg", bg: "black", w: 24, h: 24 },
  { name: "Meta AI", model: "meta-llama-3.1", icon: "meta.svg", bg: "white", w: 24, h: 16 },
  { name: "Gemini", model: "gemini-1.5 pro", icon: "gemini.svg", bg: "white", w: 24, h: 24 },
  { name: "Azure AI", model: "azure-model", icon: "azure.svg", bg: "white", w: 24, h: 22.6464 },
  { name: "Perplexity", model: "llama-3.1-sonar", icon: "perplexity.svg", bg: "", w: 40, h: 40 },
  { name: "Anthropic", model: "claude-3-5-sonnet", icon: "claude.svg", bg: "black", w: 40, h: 40 },
  { name: "Cohere", model: "command-r-plus", icon: "cohere.svg", bg: "", w: 40, h: 40 },
];

const track = document.getElementById("models-track");
const chip = (m) => `
  <div class="chip">
    <div class="chip__icon${m.bg ? ` chip__icon--${m.bg}` : ""}">
      <img src="assets/${m.icon}" width="${m.w}" height="${m.h}" alt="" />
    </div>
    <div class="chip__name"><strong>${m.name}</strong><span>${m.model}</span></div>
  </div>`;
const set = [...MODELS, ...MODELS].map(chip).join("");
track.innerHTML = set + set;
track.querySelectorAll(".chip").forEach((el, i) => {
  if (i >= MODELS.length * 2) el.setAttribute("aria-hidden", "true");
});

// Hero search — typewriter through example prompts until the user types
const input = document.getElementById("search-input");
const prompts = [
  "Summarise this article and cross-check it for bias",
  "Explain quantum computing like I’m five",
  "Write a cold email for my startup pitch",
  "Which is faster for this query: SQL or NoSQL?",
];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const idle = () => document.activeElement !== input && !input.value;
if (!reduceMotion) {
  let p = 0, i = prompts[0].length, deleting = false;
  (function tick() {
    let wait = deleting ? 22 : 45;
    if (idle()) {
      const text = prompts[p];
      i += deleting ? -1 : 1;
      input.placeholder = text.slice(0, i);
      if (!deleting && i >= text.length) { deleting = true; wait = 2600; }
      else if (deleting && i <= 0) { deleting = false; p = (p + 1) % prompts.length; wait = 350; }
    }
    setTimeout(tick, wait);
  })();
}

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  input.value = "";
  input.placeholder = "Thanks! internet.io is free during beta — sign-up coming soon.";
  input.blur();
});

document.querySelectorAll('a[href="#try"]').forEach((a) =>
  a.addEventListener("click", () => setTimeout(() => input.focus({ preventScroll: true }), 400))
);

// Testimonial slider
const tTrack = document.getElementById("t-track");
const dots = [...document.querySelectorAll("#t-dots .dot")];
const total = tTrack.children.length;
let current = 0;

function go(i) {
  current = (i + total) % total;
  const stars = tTrack.children[current].querySelector("img");
  stars.classList.remove("stars-pop"); void stars.offsetWidth; stars.classList.add("stars-pop");
  tTrack.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, j) => {
    d.classList.toggle("is-active", j === current);
    d.setAttribute("aria-selected", j === current);
    d.querySelector("img").src = `assets/${j === current ? "dot-active" : "dot"}.svg`;
  });
}
document.getElementById("t-prev").addEventListener("click", () => go(current - 1));
document.getElementById("t-next").addEventListener("click", () => go(current + 1));
dots.forEach((d, i) => d.addEventListener("click", () => go(i)));

// Mobile menu
const nav = document.querySelector(".topnav");
const menuBtn = document.getElementById("menu-btn");
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
document.querySelectorAll("#primary-nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// Header hairline on scroll
const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Scroll reveal — cards stagger within their row
if ("IntersectionObserver" in window && !reduceMotion) {
  const groups = [
    [".section__head, .video, .testimonials__title, .testimonials, .cta__inner", 1],
    [".features > .card", 2], [".agents > .card", 2], [".user", 3],
  ];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  groups.forEach(([sel, per]) =>
    document.querySelectorAll(sel).forEach((el, n) => {
      el.classList.add("reveal");
      el.style.setProperty("--i", n % per);
      io.observe(el);
    })
  );
}
