/* eslint-disable no-underscore-dangle */
import { describe, expect, test } from '@jest/globals';
import { postAndParse } from './utils';

describe('/users', () => {
  test('POST /users/login failure', async () => {
    const { status } = await postAndParse('/users/login',
                                          {
                                            username: 'ekkitil',
                                            password:'tilekki'
                                          });

    expect(status).toBe(401);
  });

  test('POST /users/login success', async () => {
    const { result, status } = await postAndParse('/users/login',
                                          {
                                            username: 'admin',
                                            password:'1234'
                                          });

    expect(status).toBe(200);
    expect(result.token).toBeTruthy();
  });
});
