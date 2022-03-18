/* eslint-disable no-underscore-dangle */
import { describe, expect, test } from '@jest/globals';
import {
  createRandomUserAndReturnWithToken,
  fetchAndParse,
  loginAsHardcodedAdminAndReturnToken
} from './utils';

describe('GET /orders', () => {
  test('GET /orders requires admin', async () => {
    const { status } = await fetchAndParse('/orders')

    expect(status).toBe(401);
  });

  test('GET /orders requires admin, not user', async() => {
    const { token } = await createRandomUserAndReturnWithToken();
    expect(token).toBeTruthy();

    const { status } = await fetchAndParse('/orders', token)

    expect(status).toBe(401);
  });

  test('GET /orders success', async() => {
    const token = await loginAsHardcodedAdminAndReturnToken();
    expect(token).toBeTruthy();

    const { result, status } = await fetchAndParse('/orders', token);

    expect(status).toBe(200);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result._links).toBeDefined();
    expect(result._links.self).toBeDefined();
  });

  test('GET /orders w/admin w/offset 1 limit 1', async () => {
    const token = await loginAsHardcodedAdminAndReturnToken();
    expect(token).toBeTruthy();

    const { result, status } = await fetchAndParse('/orders?offset=1&limit=1', token);

    expect(status).toBe(200);
    expect(result.limit).toBe(1);
    expect(result.offset).toBe(1);
    expect(result.items.length).toBe(1);
    expect(result._links).toBeDefined();
    expect(result._links.self).toBeDefined();
    expect(result._links.prev).toBeDefined();
  });
});
