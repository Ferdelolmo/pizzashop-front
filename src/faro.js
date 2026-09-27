import { initializeFaro, getWebInstrumentations } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

export function initFaro() {
  const url = import.meta.env.VITE_FARO_URL;
  if (!url) return;

  const backendBase = import.meta.env.VITE_API_BASE_URL || '/api';
  const propagateTraceHeaderCorsUrls = backendBase.startsWith('http')
    ? [new URL(backendBase).origin]
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
