/* eslint-disable no-underscore-dangle */
import { describe, expect, test } from '@jest/globals'
import { fetchAndParse } from './utils';

describe('GET /menu', () => {
  test('GET /menu', async () => {
    const { result, status } = await fetchAndParse('/menu');

    expect(status).toBe(200);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result._links).toBeDefined();
    expect(result._links.self).toBeDefined();
  });

  test('GET /menu offset and limit', async () => {
    const { result, status } = await fetchAndParse('/menu?offset=1&limit=1');

    expect(status).toBe(200);
    expect(result.limit).toBe(1);
    expect(result.offset).toBe(1);
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result._links).toBeDefined();
    expect(result._links.self).toBeDefined();
  });

  test('GET /menu category', async () => {
    const { result, status } = await fetchAndParse('/menu?category=1');

    expect(status).toBe(200);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result._links).toBeDefined();
    expect(result._links.self).toBeDefined();
  });

  test('GET /menu search title', async () => {
    const { result, status } = await fetchAndParse('/menu?search=Kjúklingur');

    expect(status).toBe(200);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result._links).toBeDefined();
    expect(result._links.self).toBeDefined();
  });

  test('GET /menu search description', async () => {
    const { result, status } = await fetchAndParse('/menu?search=rfc');

    expect(status).toBe(200);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result._links).toBeDefined();
    expect(result._links.self).toBeDefined();
  });
});
