import client from 'prom-client';
import pino from 'pino';
import { Span, Tracer, trace } from '@opentelemetry/api';

export type LogEntry = {
  timestamp: string;
  level: string;
  message: string;
  attrs?: Record<string, any>;
};

/** MetricsCollector - central place for application metrics (prom-client) */
export class MetricsCollector {
  private registry: client.Registry;
  private counters: Map<string, client.Counter<string>> = new Map();

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry });
  }

  createCounter(name: string, help = 'counter', labelNames: string[] = []) {
    if (!this.counters.has(name)) {
      const c = new client.Counter({ name, help, labelNames, registers: [this.registry] });
      this.counters.set(name, c);
    }
    return this.counters.get(name)!;
  }

  increment(name: string, labels?: Record<string, string>, value = 1) {
    const c = this.createCounter(name);
    if (labels) c.inc(labels, value);
    else c.inc(value);
  }

  async metrics(): Promise<string> {
    return await this.registry.metrics();
  }
}

/** LogCollector - simple in-memory buffer + pino logger */
export class LogCollector {
  private buffer: LogEntry[] = [];
  private readonly maxSize: number;
  private logger: pino.Logger;

  constructor(maxSize = 250) {
    this.maxSize = maxSize;
    this.logger = pino({ name: 'observa-sentinel', level: 'info' });
  }

  push(entry: Omit<LogEntry, 'timestamp'>) {
    const item: LogEntry = { ...entry, timestamp: new Date().toISOString() };
    this.buffer.push(item);
    if (this.buffer.length > this.maxSize) this.buffer.shift();
    // Also log to stdout with pino
    this.logger[entry.level as keyof pino.Logger](entry.attrs || {}, entry.message);
    return item;
  }

  list(limit = 100): LogEntry[] {
    return this.buffer.slice(-limit).reverse();
  }
}

/** TraceCollector - very small wrapper around OpenTelemetry tracer */
export class TraceCollector {
  private tracer: Tracer;

  constructor(serviceName = 'observa-sentinel') {
    // use default global tracer provider
    this.tracer = trace.getTracer(serviceName);
  }

  startSpan(name: string): Span {
    return this.tracer.startSpan(name);
  }

  // helper to instrument a function
  async withSpan<T>(name: string, fn: (span: Span) => Promise<T>): Promise<T> {
    const span = this.startSpan(name);
    try {
      const res = await fn(span);
      span.end();
      return res;
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: 2, message: String(err) });
      span.end();
      throw err;
    }
  }
}

// default singletons used by API routes
export const metricsCollector = new MetricsCollector();
export const logCollector = new LogCollector(Number(process.env.LOG_BUFFER_SIZE || 250));
export const traceCollector = new TraceCollector();
