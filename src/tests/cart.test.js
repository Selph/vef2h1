import { describe, expect, test } from '@jest/globals';
import { fetchAndParse } from './utils';

describe('/cart', () => {
  test('GET /cart/:cartid success', async() => {
      const { result, status } = await fetchAndParse('/cart/f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0');

      expect(status).toBe(200)
      expect(result.length).toBeGreaterThanOrEqual(1)
  });

  test('GET /cart/:cartid failure', async() => {
    const { status } = await fetchAndParse('/cart/ekkitil');

    expect(status).toBe(404)
});
});
