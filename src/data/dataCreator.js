import { promises } from 'fs';
import { query } from '../db.js';
import { debug } from '../utils/debug.js';

export async function createRest(images) {
  const data = await promises.readFile('./src/data/products.json');

  const products = JSON.parse(data)

  for (let i = 0; i < 15; i += 1) {
    const q = `
      INSERT INTO products
        (title, price, description, image, category)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *`;

    const { title, price, description, category } = products[i];
    const image = images[i];

    const values = [
      title,
      price,
      description,
      image,
      category
    ]

    let result;

    try {
      result = await query(q, values); // eslint-disable-line
    } catch (e) {
      console.info('Reyndi að búa til', products[i]);
      throw e;
    }

    if (products.length > 20 && i % (products.length / 10) === 0) {
      debug(`Búið að bæta ${i} RFC vörum í gagnagrunn`);
    }
  }
}
