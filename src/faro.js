import { initializeFaro, getWebInstrumentations } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

export function initFaro() {
  const url = import.meta.env.VITE_FARO_URL;
  if (!url) return;

  // Backend calls go cross-origin (github.io -> vercel.app), so the tracing
  // instrumentation needs to be told explicitly to attach traceparent/tracestate
  // there. Without this it only propagates to same-origin requests, and frontend
  // + backend spans never join into one trace.
  // NOTE: OTel's urlMatches() only does an exact string equality check when an
  // entry here is a plain string — it does NOT match origin-as-prefix. It must
  // be a RegExp to match every path under the backend's origin.
  const backendBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const propagateTraceHeaderCorsUrls = backendBase.startsWith('http')
    ? [new RegExp(`^${new URL(backendBase).origin}`)]
    : [];

  initializeFaro({
    url,
    app: { name: 'pizza-frontend', version: '1.0.0' },
    instrumentations: [
      ...getWebInstrumentations(),
      new TracingInstrumentation({
        instrumentationOptions: {
          propagateTraceHeaderCorsUrls,
        },
      }),
    ],
  });
}
