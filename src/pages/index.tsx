import React, { useEffect, useState } from 'react';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<string>('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchMetrics() {
    const res = await fetch('/api/metrics');
    const text = await res.text();
    setMetrics(text);
  }

  async function fetchLogs() {
    const res = await fetch('/api/logs');
    const json = await res.json();
    setLogs(json.logs || []);
  }

  useEffect(() => {
    setLoading(true);
    fetchMetrics().catch(console.error).finally(() => setLoading(false));
    fetchLogs().catch(console.error);
  }, []);

  async function sendTestLog() {
    await fetch('/api/ingest/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: 'info', message: 'Test log from dashboard', attrs: { from: 'ui' } })
    });
    await fetchLogs();
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Observa Sentinel — Demo Dashboard</h1>
      <p>A minimal observability playground: metrics, logs, traces.</p>

      <section style={{ marginTop: 16 }}>
        <h2>Metrics</h2>
        <button onClick={() => fetchMetrics()} disabled={loading}>Refresh Metrics</button>
        <pre style={{ background: '#0b1020', color: '#e6eef8', padding: 12, whiteSpace: 'pre-wrap', marginTop: 8 }}>{metrics}</pre>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>Logs (recent)</h2>
        <button onClick={sendTestLog}>Send Test Log</button>
        <button onClick={fetchLogs} style={{ marginLeft: 8 }}>Refresh Logs</button>
        <ul>
          {logs.map((l: any, i: number) => (
            <li key={i}><strong>{l.level}</strong> <em>{l.timestamp}</em> — {l.message} {l.attrs && <small>({JSON.stringify(l.attrs)})</small>}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Dashboard;
