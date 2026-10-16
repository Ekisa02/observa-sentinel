import type { NextApiRequest, NextApiResponse } from 'next';
import { logCollector } from '../../lib/observability/core';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const limit = parseInt(String(req.query.limit || '100'), 10);
    res.status(200).json({ logs: logCollector.list(limit) });
    return;
  }
  res.setHeader('Allow', 'GET');
  res.status(405).end('Method Not Allowed');
}
