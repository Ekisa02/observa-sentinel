import { LogCollector } from '../src/lib/observability/core';

describe('LogCollector', () => {
  it('stores and returns logs', () => {
    const lc = new LogCollector(3);
    lc.push({ level: 'info', message: 'one' });
    lc.push({ level: 'error', message: 'two' });
    lc.push({ level: 'debug', message: 'three' });
    lc.push({ level: 'info', message: 'four' });
    const list = lc.list(10);
    // should keep only last 3
    expect(list.length).toBe(3);
    expect(list[0].message).toBe('four');
  });
});
