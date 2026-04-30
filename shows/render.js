/* ──────────────────────────────────────────────────────────────────────────
 *  shows/render.js — hydrate the Network Shows grid from the canonical
 *  ConversationOS public endpoint so the page reflects whatever the
 *  customer last saved on app.conversationos.live.
 *
 *  Source of truth:
 *    GET https://app.conversationos.live/api/public/shows
 *    Returns { shows: PublicShowCard[] } where each card carries the
 *    fields the network page renders (slug, name, tagline, heroImage,
 *    schedulePhrase, categories, hostName, acceptingGuests, bookingUrl,
 *    isFlagship, …). Visibility is gated server-side by
 *    network.featured === true on the canonical Show.
 *
 *  Rendering strategy:
 *    1. The HTML ships with hardcoded fallback cards for the four
 *       launch shows. If the fetch fails (offline, API outage, or
 *       Cloudflare cache miss with origin error), those cards stay
 *       on screen — the page never goes blank.
 *    2. On successful fetch, we replace the inner HTML of
 *       .shows-grid with freshly-rendered cards. That keeps the static
 *       site SEO-friendly (search engines still see the fallback) and
 *       brings live data to anyone with JS enabled.
 *    3. CSS classes match the existing static cards 1:1 so styling
 *       (gradient overlays, flagship badge, tag chips, CTA arrow) is
 *       inherited verbatim.
 *
 *  Producer experience:
 *    A producer flips network.featured on the Edit tab of
 *    app.conversationos.live → endpoint cache TTL is 60s → guestengine
 *    .live show grid updates within a minute. No deploy required.
 *
 *  This file is intentionally vanilla JS (no build step). guestengine
 *  .live is an nginx-only static site; adding a bundler isn't worth it
 *  for ~150 lines of glue.
 *  ────────────────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  // Origin of the canonical public API. Hardcoded because guestengine
  // .live always points at production app.conversationos.live; staging
  // doesn't run a dedicated public site.
  var API_ORIGIN = "https://app.conversationos.live";
  var API_PATH = "/api/public/shows";

  // Tags on the cards carry CamelCase / Title-Case from the canonical
  // categories array. The static HTML renders them in title-case
  // ("Business", "Leadership"), so we lowercase-then-titlecase to
  // match exactly. Empty input returns empty.
  function toTitleCase(s) {
    if (!s) return "";
    return String(s)
      .toLowerCase()
      .split(/\s+/)
      .map(function (w) { return w ? (w.charAt(0).toUpperCase() + w.slice(1)) : ""; })
      .join(" ");
  }

  // Build a single show-card DOM node identical in shape to the static
  // fallback markup. Returns an HTMLElement (not a string) so we can
  // attach event listeners later if needed without re-parsing.
  function renderCard(show) {
    var li = document.createElement("div");
    li.className = "show-card" + (show.isFlagship ? " flagship" : "");
    li.setAttribute("data-slug", show.slug || "");

    // ── Image block ──
    var imgWrap = document.createElement("div");
    imgWrap.className = "show-card__image";

    var img = document.createElement("img");
    img.src = show.heroImage || "";
    img.alt = show.name || "";
    img.loading = "lazy";
    if (show.heroPosition) {
      // The canonical hero ships with a CSS background-position string
      // (e.g. "center 25%") so faces stay in frame. <img> doesn't honor
      // background-position, so translate it to object-position.
      img.style.objectPosition = show.heroPosition;
      img.style.objectFit = "cover";
    }
    imgWrap.appendChild(img);

    var overlay = document.createElement("div");
    overlay.className = "overlay";
    imgWrap.appendChild(overlay);

    if (show.isFlagship) {
      var badge = document.createElement("span");
      badge.className = "show-card__badge";
      badge.innerHTML = '<i class="fas fa-crown"></i> Flagship';
      imgWrap.appendChild(badge);

      var liveDot = document.createElement("span");
      liveDot.className = "show-card__live-dot";
      liveDot.textContent = "Live Daily";
      imgWrap.appendChild(liveDot);
    }

    li.appendChild(imgWrap);

    // ── Body block ──
    var body = document.createElement("div");
    body.className = "show-card__body";

    var h2 = document.createElement("h2");
    h2.className = "show-card__name";
    h2.textContent = show.name || "";
    body.appendChild(h2);

    if (show.hostName) {
      var hostP = document.createElement("p");
      hostP.className = "show-card__host";
      hostP.innerHTML = "Hosted by <strong></strong>";
      hostP.querySelector("strong").textContent = show.hostName;
      body.appendChild(hostP);
    }

    if (show.tagline) {
      var desc = document.createElement("p");
      desc.className = "show-card__desc";
      desc.textContent = show.tagline;
      body.appendChild(desc);
    }

    // Meta row: schedule + format. We always show schedulePhrase since
    // the projection always returns at least "Live show".
    var meta = document.createElement("div");
    meta.className = "show-card__meta";
    if (show.schedulePhrase) {
      var schedSpan = document.createElement("span");
      schedSpan.className = "meta-item";
      // Heuristic: if the phrase mentions a time, prefix with calendar
      // icon; otherwise prefix with the video-camera icon (matches the
      // existing static cards' pattern).
      var iconClass = /\d/.test(show.schedulePhrase) ? "fa-calendar" : "fa-video";
      schedSpan.innerHTML = '<i class="fas ' + iconClass + '"></i> ' + show.schedulePhrase;
      meta.appendChild(schedSpan);
    }
    body.appendChild(meta);

    // Categories → tags
    var tags = document.createElement("div");
    tags.className = "show-card__tags";
    (show.categories || []).slice(0, 4).forEach(function (cat) {
      var tag = document.createElement("span");
      tag.textContent = toTitleCase(cat);
      tags.appendChild(tag);
    });
    body.appendChild(tags);

    // CTA. Hide entirely when acceptingGuests is false so the card
    // doesn't render a dead link.
    if (show.acceptingGuests) {
      var cta = document.createElement("a");
      cta.className = "show-card__cta";
      // bookingUrl from the API is either a fully-qualified URL or a
      // relative path like "/book/<slug>". Fall through to /join/
      // (the legacy static target) when missing.
      cta.href = show.bookingUrl || "/join/";
      cta.innerHTML = 'Book This Show <i class="fas fa-arrow-right"></i>';
      body.appendChild(cta);
    } else {
      var paused = document.createElement("p");
      paused.className = "show-card__paused";
      paused.textContent = "Currently not accepting outside guests";
      paused.style.cssText = "margin-top:12px;font-size:12px;color:rgba(255,255,255,0.4);font-style:italic;";
      body.appendChild(paused);
    }

    li.appendChild(body);
    return li;
  }

  // Replace the contents of .shows-grid with cards rendered from data.
  // The container is required to exist; the page ships with it as the
  // wrapper for the static fallback cards.
  function renderInto(container, shows) {
    // Clear the static fallback only after we have data, so a slow
    // network never produces a blank grid.
    container.innerHTML = "";
    shows.forEach(function (s) {
      container.appendChild(renderCard(s));
    });
  }

  function hydrate() {
    var grid = document.querySelector(".shows-grid");
    if (!grid) return;

    // Guard: don't try to fetch in environments where fetch is missing
    // (very old browsers). The static fallback is sufficient.
    if (typeof fetch !== "function") return;

    fetch(API_ORIGIN + API_PATH, {
      // No credentials — the endpoint is unauthenticated and CORS
      // wildcard. This avoids browsers attaching cookies cross-origin.
      credentials: "omit",
      // Use the browser's HTTP cache so repeat visits are instant.
      cache: "default",
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (payload) {
        var shows = (payload && Array.isArray(payload.shows)) ? payload.shows : [];
        // Defensive: only swap when the API returned at least one
        // show. An empty array is suspicious enough that we'd rather
        // keep the static fallback than render an empty page.
        if (shows.length === 0) return;
        renderInto(grid, shows);
        // Tag the grid so dev tools / QA can verify the swap happened.
        grid.setAttribute("data-source", "canonical");
        grid.setAttribute("data-show-count", String(shows.length));
      })
      .catch(function (err) {
        // Never let a fetch error blank the page — the static cards
        // already rendered as the initial HTML. We log and bail.
        if (window && window.console && console.warn) {
          console.warn("[guestengine] /api/public/shows fetch failed; keeping static fallback", err);
        }
      });
  }

  // Run after the static markup is parsed. The script is loaded with
  // `defer` in the HTML so DOMContentLoaded already fires before this
  // executes; calling immediately also handles the rare case where a
  // user agent ignores defer.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrate);
  } else {
    hydrate();
  }
})();
