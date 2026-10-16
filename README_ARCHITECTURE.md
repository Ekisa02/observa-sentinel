# Architecture Notes

Observa Sentinel intentionally keeps responsibilities separated and modular.

- API surface (Next.js API Routes)
  - /api/metrics — registry scrape endpoint
  - /api/ingest/logs — ingestion point for logs
  - /api/logs — in-memory log viewer
  - /api/health — basic readiness check

- Core collectors
  - src/lib/observability/core.ts
    - MetricsCollector wraps prom-client
    - LogCollector wraps pino plus an in-memory ring
    - TraceCollector wraps OpenTelemetry API for local instrumentation

- Exporters
  - src/services/exporters/otlpExporter.ts — shows how to wire OTLP but is a stub

- UI
  - Minimal dashboard at /, purely demonstrative

This layout makes it easy to swap implementations: e.g., add a Kafka producer in exporters, replace the in-memory log buffer with a Logstash pipeline, or register additional metrics.
