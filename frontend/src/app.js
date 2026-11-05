import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.CAMPUS_CONFIG || {};
const apiBase = String(config.apiBaseUrl || "https://camp-1-dufr.onrender.com").replace(/\/$/, "");
const supabase = config.supabaseUrl && config.supabasePublishableKey
  ? createClient(config.supabaseUrl, config.supabasePublishableKey)
  : null;

const state = {
  view: location.hash.startsWith("#/tickets") ? "tickets" : "events",
  eventId: null,
  selectedEvent: null,
  detailLoading: false,
  detailError: "",
  events: [],
  registrations: [],
  session: null,
  authMode: "signin",
  category: "All",
  query: "",
  busy: false,
  notice: "",
  noticeType: "info",
};

const categories = ["All", "Technical", "Cultural", "Sports", "Workshops"];
const app = document.querySelector("#app");
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
const initials = (value = "Campus") => value.trim().split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");

function navigate(view, eventId = null, selectedEvent = null) {
  state.view = view;
  state.eventId = eventId;
  if (view === "details") {
    state.selectedEvent = selectedEvent || state.events.find((event) => String(eventInfo(event).id) === String(eventId)) || null;
    state.detailLoading = !state.selectedEvent && Boolean(eventId);
    state.detailError = "";
  } else {
    state.selectedEvent = null;
    state.detailLoading = false;
    state.detailError = "";
  }
  state.notice = "";
  location.hash = view === "tickets" ? "#/tickets" : eventId ? `#/event/${encodeURIComponent(eventId)}` : "#/events";
  render();
  if (view === "details" && !state.selectedEvent && eventId) loadEventDetails(eventId);
}

function setNotice(message, type = "info") {
  state.notice = message;
  state.noticeType = type;
  render();
}

function dateLabel(event) {
  const raw = event.timestamp || event.date || event.start_time;
  if (!raw) return "Date to be announced";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return String(raw);
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function eventInfo(event) {
  return {
    id: event.id ?? event.event_id ?? event.uuid,
    title: event.title || "Campus event",
    category: event.category || "Campus",
    description: event.description || event.details || "The organizer will share more details soon.",
    date: dateLabel(event),
    venue: event.venue || event.location || "Venue to be announced",
    capacity: event.capacity,
    price: event.price ?? event.ticket_price,
  };
}

async function api(path, options = {}) {
  const token = state.session?.access_token;
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || payload.message || `Request failed (${response.status})`);
  return payload;
}

async function loadEvents() {
  state.events = await api("/api/events");
  if (!Array.isArray(state.events)) state.events = [];
}

async function loadRegistrations() {
  state.registrations = await api("/api/me/registrations");
  if (!Array.isArray(state.registrations)) state.registrations = [];
}

async function loadEventDetails(eventId) {
  try {
    const event = await api(`/api/events/${encodeURIComponent(eventId)}`);
    if (state.view !== "details" || String(state.eventId) !== String(eventId)) return;
    state.selectedEvent = event;
    state.detailLoading = false;
    state.detailError = "";
    render();
  } catch (error) {
    if (state.view !== "details" || String(state.eventId) !== String(eventId)) return;
    state.detailLoading = false;
    state.detailError = error.message || "The event details could not be loaded.";
    render();
  }
}

function noticeMarkup() {
  return state.notice ? `<div class="notice ${state.noticeType}" role="status">${escapeHtml(state.notice)}</div>` : "";
}

function header() {
  const user = state.session?.user;
  const label = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Campus user";
  return `<header class="topbar"><a class="brand" href="#/events" data-nav="events"><span class="brand-icon">✳</span>CampusConnect</a><nav class="main-nav"><a class="${state.view !== "tickets" ? "active" : ""}" href="#/events" data-nav="events">Explore events</a><a class="${state.view === "tickets" ? "active" : ""}" href="#/tickets" data-nav="tickets">My tickets</a></nav><div class="top-actions">${user ? `<span class="user-chip"><span class="avatar">${escapeHtml(initials(label))}</span><span>${escapeHtml(label)}</span></span><button class="button button-quiet" data-action="signout">Sign out</button>` : `<button class="button button-quiet" data-action="signin">Sign in</button>`}</div></header>`;
}

function hero() {
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow">YOUR CAMPUS, IN FULL COLOUR</span><h1>Find your next<br><span>campus moment.</span></h1><p>Meet your people, try something new, and make this semester one to remember.</p><a class="button button-light" href="#events-grid">Explore events <span aria-hidden="true">↘</span></a></div><div class="hero-art" aria-hidden="true"><div class="sun"></div><div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div><div class="hero-spark spark-one">✦</div><div class="hero-spark spark-two">✳</div><div class="hero-disc">CAMPUS<br>IS HAPPENING</div><div class="hero-ribbon">TECH · CULTURE · PEOPLE · IDEAS ·</div></div><span class="hero-index">01 / DISCOVER</span></section>`;
}

function card(event) {
  const item = eventInfo(event);
  const category = item.category.toLowerCase().replace(/[^a-z]/g, "") || "campus";
  const price = item.price == null ? "Free / check details" : `₹${escapeHtml(item.price)}`;
  return `<article class="event-card"><div class="card-art art-${escapeHtml(category)}"><span class="art-index">CAMPUSCONNECT / EVENT</span><span class="art-symbol" aria-hidden="true">${category === "sports" ? "↗" : category === "cultural" ? "♫" : category === "workshops" ? "✳" : "✦"}</span><span class="art-word">${escapeHtml(item.category)}</span></div><div class="card-body"><div class="card-meta"><span class="tag">${escapeHtml(item.category)}</span><span class="price">${price}</span></div><h3>${escapeHtml(item.title)}</h3><p class="card-detail"><span aria-hidden="true">◷</span>${escapeHtml(item.date)}</p><p class="card-detail"><span aria-hidden="true">⌖</span>${escapeHtml(item.venue)}</p><button class="button button-outline card-button" data-open-event="${escapeHtml(item.id)}">View event <span aria-hidden="true">↗</span></button></div></article>`;
}

function filteredEvents() {
  const query = state.query.trim().toLowerCase();
  return state.events.filter((event) => {
    const item = eventInfo(event);
    return (state.category === "All" || item.category.toLowerCase() === state.category.toLowerCase())
      && (!query || `${item.title} ${item.category} ${item.venue} ${item.description}`.toLowerCase().includes(query));
  });
}

function eventsPage() {
  const events = filteredEvents();
  const noConfig = !supabase;
  return `${header()}<main><div class="page-wrap">${hero()}${noticeMarkup()}<section class="events-section" id="events-grid"><div class="section-heading"><div><span class="eyebrow">MAKE ROOM FOR SOMETHING GOOD</span><h2>Upcoming on campus</h2><p>Small plans. Big stories.</p></div><label class="search"><span aria-hidden="true">⌕</span><input id="event-search" type="search" value="${escapeHtml(state.query)}" placeholder="Search events" aria-label="Search events"></label></div><div class="filters">${categories.map((item) => `<button class="filter ${state.category === item ? "selected" : ""}" data-category="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}</div>${noConfig ? `<div class="notice warning">Add your Supabase URL and publishable key to enable sign-in and registration.</div>` : ""}${events.length ? `<div class="event-grid">${events.map(card).join("")}</div>` : `<div class="empty"><span class="empty-icon">✳</span><h3>No events match yet</h3><p>Try another search or check back soon.</p></div>`}</section><section class="organizer-note"><span class="note-icon">✳</span><div><h3>Organize something for your campus?</h3><p>Organizer tools are being connected to the API. Event creation is not available yet.</p></div><span class="coming-soon">COMING SOON</span></section></div></main><footer><span class="brand"><span class="brand-icon">✳</span>CampusConnect</span><span>Good things happen when campus comes together.</span></footer>`;
}

function detailsPage() {
  const raw = state.selectedEvent || state.events.find((event) => String(eventInfo(event).id) === String(state.eventId));
  if (!raw && state.detailLoading) return `${header()}<main class="page-wrap"><div class="empty"><span class="spinner"></span><h2>Loading event details…</h2></div></main>`;
  if (!raw) return `${header()}<main class="page-wrap"><div class="empty"><h2>Couldn’t open this event</h2><p>${escapeHtml(state.detailError || "This event may have been removed. Return to the event list and try again.")}</p><button class="button button-outline" data-nav="events">Back to events</button></div></main>`;
  const item = eventInfo(raw);
  const alreadyRegistered = state.registrations.some((registration) => String(registration.event_id) === String(item.id));
  return `${header()}<main class="page-wrap detail-wrap">${noticeMarkup()}<button class="back-link" data-nav="events">← Back to events</button><div class="detail-layout"><section><div class="detail-art"><span class="eyebrow">CAMPUSCONNECT EVENT · ${escapeHtml(item.category.toUpperCase())}</span><div class="detail-art-letter">${escapeHtml(item.category.slice(0, 1).toUpperCase())}</div><div class="detail-art-title">${escapeHtml(item.title)}</div></div><span class="tag">${escapeHtml(item.category)}</span><h1 class="detail-title">${escapeHtml(item.title)}</h1><p class="detail-description">${escapeHtml(item.description)}</p><div class="detail-info"><div><span>DATE & TIME</span><strong>${escapeHtml(item.date)}</strong></div><div><span>LOCATION</span><strong>${escapeHtml(item.venue)}</strong></div><div><span>CAPACITY</span><strong>${item.capacity == null ? "Details to be announced" : escapeHtml(item.capacity)}</strong></div></div></section><aside class="register-card"><span class="eyebrow">YOUR NEXT CAMPUS MOMENT</span><h2>Come be part of it.</h2><p>${item.price == null ? "Check with the organizer for event costs." : `Ticket price: ₹${escapeHtml(item.price)}`}</p>${alreadyRegistered ? `<div class="success-box">You’re registered for this event. See it in My tickets.</div><button class="button button-dark full" data-nav="tickets">View my tickets</button>` : `<button class="button button-dark full" data-action="register" data-event-id="${escapeHtml(item.id)}" ${state.busy ? "disabled" : ""}>${state.busy ? "Saving your place…" : "Register for event ↗"}</button>`}<p class="fine-print">Registration saves your place. Payment is not collected through CampusConnect.</p></aside></div></main><footer><span class="brand"><span class="brand-icon">✳</span>CampusConnect</span><span>Good things happen when campus comes together.</span></footer>`;
}

function ticketsPage() {
  if (!state.session) return `${header()}<main class="page-wrap tickets-page">${noticeMarkup()}<div class="tickets-heading"><span class="eyebrow">YOUR CAMPUS PLANS</span><h1>My tickets</h1><p>Sign in to see the events you’ve registered for.</p><button class="button button-dark" data-action="signin">Sign in to continue</button></div></main>`;
  const events = new Map(state.events.map((event) => [String(event.id), event]));
  const tickets = state.registrations.map((registration) => ({ registration, event: events.get(String(registration.event_id)) })).filter((row) => row.event);
  return `${header()}<main class="page-wrap tickets-page">${noticeMarkup()}<div class="tickets-heading"><span class="eyebrow">YOUR CAMPUS PLANS</span><h1>My tickets</h1><p>Your registrations, all in one place.</p></div>${tickets.length ? `<div class="ticket-list">${tickets.map(({ registration, event }) => { const item = eventInfo(event); return `<article class="ticket-card"><div class="ticket-mark">✳</div><div class="ticket-main"><span class="tag">${escapeHtml(item.category)}</span><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.date)} · ${escapeHtml(item.venue)}</p><small>Registration #${escapeHtml(registration.id || "confirmed")}</small></div><span class="ticket-status">REGISTERED</span></article>`; }).join("")}</div>` : `<div class="empty"><span class="empty-icon">✳</span><h3>No registrations yet</h3><p>Find an event that feels like you and save your place.</p><button class="button button-outline" data-nav="events">Explore events</button></div>`}</main><footer><span class="brand"><span class="brand-icon">✳</span>CampusConnect</span><span>Good things happen when campus comes together.</span></footer>`;
}

function authPage() {
  const signup = state.authMode === "signup";
  return `<div class="auth-shell"><a class="brand auth-brand" href="#/events" data-nav="events"><span class="brand-icon">✳</span>CampusConnect</a><div class="auth-card"><div class="auth-art"><span class="eyebrow">CAMPUS IS BETTER TOGETHER</span><h1>Your next<br>chapter starts<br><i>on campus.</i></h1><div class="auth-orbit">✳</div><span class="auth-caption">MEET · MAKE · BELONG</span></div><section class="auth-form-side"><button class="back-link" data-nav="events">← Back to events</button><span class="eyebrow">WELCOME TO YOUR COMMUNITY</span><h2>${signup ? "Create your account" : "Welcome back"}</h2><p>${signup ? "Find your people and make campus yours." : "Sign in and pick up where you left off."}</p>${noticeMarkup()}<form id="auth-form">${signup ? `<label>Full name<input name="fullName" autocomplete="name" required placeholder="Your name"></label>` : ""}<label>Email address<input name="email" type="email" autocomplete="email" required placeholder="you@college.edu"></label><label>Password<input name="password" type="password" minlength="6" autocomplete="${signup ? "new-password" : "current-password"}" required placeholder="At least 6 characters"></label><button class="button button-dark full" type="submit" ${state.busy ? "disabled" : ""}>${state.busy ? "Please wait…" : signup ? "Create account" : "Sign in"}</button></form><p class="auth-toggle">${signup ? "Already have an account?" : "New to CampusConnect?"} <button class="text-link" data-action="toggle-auth">${signup ? "Sign in" : "Create an account"}</button></p><p class="fine-print">Email confirmation may be required before your first sign-in.</p></section></div></div>`;
}

function render() {
  if (state.view === "auth") app.innerHTML = authPage();
  else if (state.view === "details") app.innerHTML = detailsPage();
  else if (state.view === "tickets") app.innerHTML = ticketsPage();
  else app.innerHTML = eventsPage();
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-nav]").forEach((el) => el.addEventListener("click", (event) => {
    event.preventDefault();
    navigate(el.dataset.nav === "tickets" ? "tickets" : "events");
  }));
  document.querySelectorAll("[data-category]").forEach((el) => el.addEventListener("click", () => { state.category = el.dataset.category; render(); }));
  document.querySelectorAll("[data-open-event]").forEach((el) => el.addEventListener("click", () => {
    const id = el.dataset.openEvent;
    const selected = state.events.find((event) => String(eventInfo(event).id) === String(id)) || null;
    navigate("details", id, selected);
  }));
  document.querySelector("#event-search")?.addEventListener("input", (event) => { state.query = event.target.value; const pos = event.target.selectionStart; render(); const input = document.querySelector("#event-search"); input?.focus(); input?.setSelectionRange(pos, pos); });
  document.querySelector("#auth-form")?.addEventListener("submit", submitAuth);
  document.querySelectorAll("[data-action]").forEach((el) => el.addEventListener("click", async (event) => {
    const action = el.dataset.action;
    if (action === "signin") { state.view = "auth"; state.authMode = "signin"; state.notice = ""; render(); }
    if (action === "toggle-auth") { state.authMode = state.authMode === "signin" ? "signup" : "signin"; state.notice = ""; render(); }
    if (action === "register") await registerFor(el.dataset.eventId);
    if (action === "signout" && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) setNotice(error.message, "error");
      else { state.session = null; state.registrations = []; navigate("events"); }
    }
  }));
}

async function submitAuth(event) {
  event.preventDefault();
  if (!supabase) return setNotice("Sign-in isn’t configured. Add the Supabase URL and publishable key in the frontend hosting settings.", "error");
  const values = Object.fromEntries(new FormData(event.currentTarget));
  state.busy = true; render();
  try {
    if (state.authMode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email: values.email, password: values.password, options: { data: { full_name: values.fullName } } });
      if (error) throw error;
      state.session = data.session;
      if (!data.session) { state.busy = false; return setNotice("Check your inbox to confirm your email, then sign in.", "success"); }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
      if (error) throw error;
      state.session = data.session;
    }
    state.busy = false;
    await loadRegistrations().catch(() => { state.registrations = []; });
    navigate("events");
  } catch (error) {
    state.busy = false;
    setNotice(error.message || "Could not sign in. Please try again.", "error");
  }
}

async function registerFor(eventId) {
  if (!state.session) { state.view = "auth"; state.authMode = "signin"; state.notice = "Sign in to register for this event."; return render(); }
  state.busy = true; render();
  try {
    await api("/api/registrations", { method: "POST", body: JSON.stringify({ event_id: eventId }) });
    await loadRegistrations();
    state.busy = false;
    state.notice = "You’re registered! Your place is saved.";
    state.noticeType = "success";
    render();
  } catch (error) {
    state.busy = false;
    setNotice(error.message, "error");
  }
}

window.addEventListener("hashchange", () => {
  if (location.hash.startsWith("#/tickets")) state.view = "tickets";
  else if (location.hash.startsWith("#/event/")) { state.view = "details"; state.eventId = decodeURIComponent(location.hash.slice("#/event/".length)); }
  else state.view = "events";
  render();
});

async function start() {
  try {
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      state.session = data.session;
      supabase.auth.onAuthStateChange((_event, session) => { state.session = session; if (!session) state.registrations = []; render(); });
    }
    await loadEvents();
    if (state.session) await loadRegistrations().catch(() => { state.registrations = []; });
    if (location.hash.startsWith("#/event/")) {
      state.view = "details";
      state.eventId = decodeURIComponent(location.hash.slice("#/event/".length));
      state.selectedEvent = state.events.find((event) => String(eventInfo(event).id) === String(state.eventId)) || null;
      state.detailLoading = !state.selectedEvent;
      if (!state.selectedEvent) loadEventDetails(state.eventId);
    }
    render();
  } catch (error) {
    app.innerHTML = `<main class="load-error"><span class="brand"><span class="brand-icon">✳</span>CampusConnect</span><h1>We couldn’t load campus events.</h1><p>${escapeHtml(error.message || "Please check your connection and try again.")}</p><button class="button button-dark" id="retry">Try again</button></main>`;
    document.querySelector("#retry")?.addEventListener("click", start);
  }
}

start();

