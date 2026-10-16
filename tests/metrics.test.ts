import { MetricsCollector } from '../src/lib/observability/core';

describe('MetricsCollector', () => {
  it('creates and increments counters and returns prometheus metrics text', async () => {
    const mc = new MetricsCollector();
    mc.increment('test_requests_total', { route: '/foo' }, 2);
    mc.increment('test_requests_total', { route: '/foo' }, 3);
    const out = await mc.metrics();
    expect(out).toContain('test_requests_total');
    expect(out).toContain('route="/foo"');
  });
});
