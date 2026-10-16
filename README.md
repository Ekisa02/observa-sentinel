# Observa Sentinel

Observa Sentinel is a modular DevOps observability platform prototype built with Next.js and TypeScript. It demonstrates a pragmatic, extensible architecture for collecting metrics, logs, and traces; exposing metrics for Prometheus; ingesting logs; and wiring simple exporters (OTLP stub). The repo is intended as a foundation for production-grade platforms and for experimentation with integrations.

## Architecture (high level)

- Next.js app serves both a minimal UI and API routes for ingestion and metrics exposition.
- Core observability primitives live in `src/lib/observability`:
  - MetricsCollector (prom-client) — creates & registers metrics, exposes metrics endpoint.
  - LogCollector (in-memory buffer + pino logger) — receives logs via HTTP and keeps a recent window for UI/testing.
  - TraceCollector (OpenTelemetry API wrapper) — creates spans and provides a simple export pipeline (stubbed OTLP exporter in services).
- Exporters in `src/services/exporters` implement serializing/exporting to external systems (OTLP stub included).
- UI in `src/pages` and `src/components` is minimal and meant to illustrate ingestion and metrics fetching.
- Tests (Jest + ts-jest) validate core behavior.

## Key directories

- src/lib/observability - core classes for metrics, logs, traces.
- src/pages/api - API endpoints for metrics, log ingestion, health checks.
- src/services/exporters - exporters and integrations (OTLP stub example).
- src/components - React components for the small demo dashboard.
- tests - unit tests for core collectors.

## Features

- Prometheus metrics exposition via /api/metrics
- Log ingestion API via POST /api/ingest/logs
- In-memory buffer to view recent logs via GET /api/logs
- Basic OpenTelemetry trace helper (span creation) with a pluggable exporter
- Minimal dashboard to preview metrics & logs

## Installation

Requirements: Node.js 16+ (or compatible), npm

1. Install dependencies

```bash
npm install
```

2. Running in development

```bash
npm run dev
```

The app will run at http://localhost:3000.

3. Build and run production

```bash
npm run build
npm start
```

4. Run tests

```bash
npm test
```

## Usage

1. View the dashboard at `http://localhost:3000`.
2. Scrape metrics from Prometheus or curl from the metrics endpoint:

```bash
curl http://localhost:3000/api/metrics
```

3. Ingest a log (JSON) via POST:

```bash
curl -X POST http://localhost:3000/api/ingest/logs \
  -H "Content-Type: application/json" \
  -d '{"level":"info","message":"Hello from curl","attrs":{"service":"demo"}}'
```

4. View recent logs:

```bash
curl http://localhost:3000/api/logs
```

## Configuration

Environment variables (optional):

- OTLP_ENDPOINT - URL for OTLP exporter (stub currently logs to console)
- LOG_BUFFER_SIZE - number of recent logs to keep in memory (default: 250)

You can set them in `.env.local` for local development.

## Extending

- Add more metric types (histograms, summaries), label conventions.
- Replace in-memory log buffer with a durable store or push to Loki/Elasticsearch.
- Plug a real OTLP exporter or vendor SDK into services/exporters.
- Add authentication and rate-limiting for ingestion endpoints.

## Security & Production Notes

- This prototype uses in-memory stores and no auth — do not use as-is in untrusted networks.
- Add TLS, auth, auditing, and persistent storage for production.

## License

MIT
