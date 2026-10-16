import React from 'react';

const Dashboard: React.FC<{ metrics: string; logs: any[] }> = ({ metrics, logs }) => {
  return (
    <div>
      <h3>Inline component</h3>
      <pre>{metrics.slice(0, 500)}</pre>
      <ul>
        {logs.map((l, i) => (
          <li key={i}>{l.timestamp} - {l.level} - {l.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
