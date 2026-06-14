/* ============================================================
   OUTSCOPE DESIGNS — SCRIPT  (classic script)

   Loaded as a classic <script> (not a module) so the page also works
   when opened directly via file://. Core UI (nav, menu, portfolio
   carousel) runs immediately with NO external dependency. Motion
   (motion.dev) is then loaded as a progressive enhancement via a
   dynamic import() — if its CDN ever fails, the site still works and
   all content is shown.
   ============================================================ */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (max-width: 640px)").matches;

/* ============================================================
   PROJECTS DATA
   ------------------------------------------------------------
   ADD NEW PROJECTS HERE — just push another object onto this
   array. The carousel rebuilds itself; no other code changes
   are needed.
   ============================================================ */
const projects = [
  { name: "Coffee Shop", category: "Coffee Shop", url: "https://coffeeshop-sample.vercel.app/" },
  { name: "Barbershop", category: "Barbershop", url: "https://barbershop-sample-web.vercel.app/" },
  { name: "Local Gym", category: "Fitness", url: "https://gym-web-sample.vercel.app/" },
  // { name: "SITE4_NAME", category: "SITE4_CATEGORY", url: "SITE4_URL" },
];

const fallbackColors = ["#5B6CFF", "#FF8966", "#4ECCA3", "#7B5BFF", "#FFB347", "#3FB6C9"];

/* ---------- helpers ---------- */
function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html != null) node.innerHTML = html;
  return node;
}

/* ============================================================
   1. NAV — scroll behavior
   ============================================================ */
const nav = document.getElementById("nav");
function onScroll() {
  if (window.scrollY > 24) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ============================================================
   2. MOBILE MENU
   ============================================================ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileClose = document.getElementById("mobileClose");

function openMenu() {
  mobileMenu.classList.add("open");
  hamburger.classList.add("open");
  hamburger.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  mobileMenu.classList.remove("open");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
hamburger.addEventListener("click", openMenu);
mobileClose.addEventListener("click", closeMenu);
mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

/* ============================================================
   3. PORTFOLIO CAROUSEL — build cards from `projects`
   (runs synchronously — never depends on Motion)
   ============================================================ */
const track = document.getElementById("carouselTrack");

function buildCard(project, index) {
  const card = el("a", "work-card");
  card.href = project.url;
  card.target = "_blank";
  card.rel = "noopener";
  card.setAttribute("aria-label", project.name + " — " + project.category);

  const color = fallbackColors[index % fallbackColors.length];

  const frameWrap = el("div", "work-card__frame-wrap");
  const iframe = document.createElement("iframe");
  iframe.className = "work-card__frame";
  iframe.loading = "lazy";
  iframe.setAttribute("scrolling", "no");
  iframe.setAttribute("tabindex", "-1");
  iframe.setAttribute("title", project.name + " preview");
  iframe.src = project.url;

  // Graceful failure -> colored fallback.
  const fallback = el("div", "work-card__fallback", project.name);
  fallback.style.background = "linear-gradient(135deg, " + color + ", #1A1A1A)";

  // If the iframe never loads (blocked by X-Frame-Options, offline, etc.)
  let loaded = false;
  iframe.addEventListener("load", () => { loaded = true; });
  iframe.addEventListener("error", () => card.classList.add("failed"));
  setTimeout(() => { if (!loaded) card.classList.add("failed"); }, 8000);

  frameWrap.appendChild(iframe);

  const label = el("div", "work-card__label");
  label.appendChild(el("span", "work-card__name", project.name));
  const right = el("div");
  right.style.display = "flex";
  right.style.alignItems = "center";
  right.style.gap = "8px";
  right.appendChild(el("span", "work-card__tag", project.category));
  right.appendChild(el("span", "work-card__visit", "Visit Site →"));
  label.appendChild(right);

  card.appendChild(frameWrap);
  card.appendChild(fallback);
  card.appendChild(label);

  if (!isTouch) attachHoverScroll(card, iframe);
  return card;
}

// Hover-driven auto-scroll of the iframe content (desktop, same-origin only).
function attachHoverScroll(card, iframe) {
  let rafId = null;
  let startTime = null;
  const DURATION = 7000; // ms top -> bottom

  function getDoc() {
    try { return iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document); }
    catch (e) { return null; } // cross-origin -> no access; silently skip
  }

  function step(ts) {
    const doc = getDoc();
    if (!doc || !doc.body) { rafId = null; return; }
    if (startTime == null) startTime = ts;
    const max = Math.max(0, doc.body.scrollHeight - (iframe.contentWindow.innerHeight || 853));
    const t = Math.min(1, (ts - startTime) / DURATION);
    const eased = t * t * (3 - 2 * t); // smoothstep
    iframe.contentWindow.scrollTo(0, max * eased);
    if (t < 1) rafId = requestAnimationFrame(step);
    else rafId = null;
  }

  card.addEventListener("mouseenter", () => {
    if (card.classList.contains("failed")) return;
    startTime = null;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(step);
  });
  card.addEventListener("mouseleave", () => {
    cancelAnimationFrame(rafId);
    rafId = null;
    const win = iframe.contentWindow;
    try { if (win) win.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {}
  });
}

function renderCarousel() {
  track.innerHTML = "";
  // First set
  projects.forEach((p, i) => track.appendChild(buildCard(p, i)));
  // Duplicate set for a seamless infinite loop (desktop marquee only)
  if (!isTouch) {
    projects.forEach((p, i) => {
      const dupe = buildCard(p, i);
      dupe.setAttribute("aria-hidden", "true");
      track.appendChild(dupe);
    });
  }
}
renderCarousel();

/* ============================================================
   4. MOTION (motion.dev) — progressive enhancement
   ------------------------------------------------------------
   Loaded via dynamic import so a CDN failure can never take the
   core site down with it. On failure we just reveal all content.
   ============================================================ */
import("https://cdn.jsdelivr.net/npm/motion@latest/+esm")
  .then((Motion) => initMotion(Motion))
  .catch((err) => {
    console.warn("Motion failed to load — showing all content statically.", err);
    document.documentElement.classList.add("force-reveal");
  });

function initMotion({ animate, inView, stagger }) {
  // Tell the HTML safety net that Motion is here and will handle reveals.
  document.documentElement.classList.add("motion-ready");

  /* ---- Hero: staggered spring entrance ---- */
  const heroItems = document.querySelectorAll(".hero .reveal");
  if (heroItems.length) {
    if (prefersReduced) {
      heroItems.forEach((e) => { e.style.opacity = 1; e.style.transform = "none"; });
    } else {
      animate(
        heroItems,
        { opacity: [0, 1], y: [34, 0] },
        { delay: stagger(0.12, { start: 0.15 }), type: "spring", stiffness: 90, damping: 18 }
      );
    }
  }

  /* ---- Decorative shapes float + spin via CSS keyframes (see style.css) ---- */

  /* ---- Scroll reveals: spring on enter (replaces IntersectionObserver) ---- */
  document.querySelectorAll(".reveal").forEach((node) => {
    if (node.closest(".hero")) return; // hero handled above
    if (prefersReduced) { node.style.opacity = 1; node.style.transform = "none"; return; }

    const delay = (parseInt(node.dataset.delay, 10) || 0) * 0.09;
    // The featured pricing card rests at scale 1.04; include it so Motion's
    // composed transform doesn't drop the CSS scale when it animates y.
    const rest = node.classList.contains("price-card--featured") ? 1.04 : 1;
    const keyframes = rest === 1
      ? { opacity: [0, 1], y: [36, 0] }
      : { opacity: [0, 1], y: [36, 0], scale: [rest, rest] };
    const stop = inView(
      node,
      () => {
        animate(node, keyframes, { type: "spring", stiffness: 80, damping: 18, delay });
        if (stop) stop(); // run once
      },
      { amount: 0.15 }
    );
  });

  /* ---- Process timeline: draw connecting line on scroll ---- */
  const timeline = document.getElementById("timeline");
  if (timeline) {
    const stopTl = inView(timeline, () => {
      timeline.classList.add("drawn"); // CSS transition draws the progress line
      if (stopTl) stopTl();
    }, { amount: 0.35 });
  }

  /* ---- Subtle hover micro-interactions (spring) ----
     Transforms are owned here; CSS handles shadow/border/colour on
     :hover so the two never fight over the same property. ---- */
  function springHover(selector, { scale = 1.03, lift = 0, rest = 1 } = {}) {
    if (isTouch || prefersReduced) return;
    document.querySelectorAll(selector).forEach((node) => {
      const enter = () =>
        animate(node, { y: lift, scale: scale },
          { type: "spring", stiffness: 320, damping: 20 });
      const leave = () =>
        animate(node, { y: 0, scale: rest },
          { type: "spring", stiffness: 320, damping: 24 });
      node.addEventListener("mouseenter", enter);
      node.addEventListener("focus", enter);
      node.addEventListener("mouseleave", leave);
      node.addEventListener("blur", leave);
    });
  }

  springHover(".btn", { scale: 1.04, lift: -2 });
  springHover(".service-card", { scale: 1.02, lift: -6 });
  springHover(".price-card:not(.price-card--featured)", { scale: 1.02, lift: -6 });
  springHover(".price-card--featured", { scale: 1.06, lift: -6, rest: 1.04 });
  springHover(".team-card", { scale: 1.03, lift: -4 });
  springHover(".reachout__card", { scale: 1.03, lift: -5 });
  springHover(".intake-cta", { scale: 1.01, lift: -3 });
}

/* ------------------------------------------------------------
   NOTE: The client intake form is hosted on Notion, which blocks
   iframe embedding (X-Frame-Options: SAMEORIGIN), so it's a simple
   link-out button in the contact section — no JS needed here.
   ------------------------------------------------------------ */
