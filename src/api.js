// Base URL for backend calls. In production the browser sees /pizza/api/*
// (same-origin, proxied by the main-site Vercel project). In local dev the
// Vite dev-server proxy in vite.config.js catches /api/* and forwards it,
// so leaving VITE_API_BASE_URL unset makes dev "just work" against a locally
// running backend.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json();
  if (!res.ok) {
    const error = new Error(body.message || 'Request failed');
    error.name = body.error || 'RequestError';
    error.traceId = body.traceId;
    throw error;
  }
  return body;
}

export function getMenu() {
  return request('/menu');
}

export function placeOrder(pizza, toppings) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify({ pizza, toppings }),
  });
}
