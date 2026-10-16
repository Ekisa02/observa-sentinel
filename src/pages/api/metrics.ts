import type { NextApiRequest, NextApiResponse } from 'next';
import { metricsCollector } from '../../lib/observability/core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // example metric:
  metricsCollector.increment('requests_total', { route: req.url || 'unknown', method: req.method || 'GET' });

  try {
    const metrics = await metricsCollector.metrics();
    res.setHeader('Content-Type', 'text/plain; version=0.0.4');
    res.status(200).send(metrics);
  } catch (err) {
    res.status(500).json({ error: 'failed to collect metrics' });
  }
}
