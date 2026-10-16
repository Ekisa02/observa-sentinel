import type { NextApiRequest, NextApiResponse } from 'next';
import { logCollector } from '../../lib/observability/core';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const body = req.body || {};
    const level = (body.level as string) || 'info';
    const message = (body.message as string) || 'log';
    const attrs = body.attrs || {};

    const entry = logCollector.push({ level, message, attrs });
    res.status(201).json({ ok: true, entry });
    return;
  }

  res.setHeader('Allow', 'POST');
  res.status(405).end('Method Not Allowed');
}
