import axios from 'axios';

export type OtlpConfig = {
  endpoint?: string;
};

export class OtlpExporter {
  private endpoint?: string;

  constructor(cfg: OtlpConfig = {}) {
    this.endpoint = cfg.endpoint || process.env.OTLP_ENDPOINT;
  }

  async exportTrace(payload: any) {
    // stub: in a real impl send to OTLP/collector
    if (!this.endpoint) {
      // fallback: log to console
      console.log('[OTLP STUB] trace payload', JSON.stringify(payload).slice(0, 200));
      return;
    }

    try {
      await axios.post(this.endpoint, payload, { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error('OTLP export error', err);
    }
  }

  async exportLogs(payload: any) {
    if (!this.endpoint) {
      console.log('[OTLP STUB] logs payload', JSON.stringify(payload).slice(0, 200));
      return;
    }
    try {
      await axios.post(this.endpoint, payload);
    } catch (err) {
      console.error('OTLP export error', err);
    }
  }
}
