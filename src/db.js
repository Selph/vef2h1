import { readFile } from 'fs/promises';
// eslint-disable-next-line import/no-unresolved
import bcrypt from 'bcrypt';
import pg from 'pg';
import xss from 'xss';

const SCHEMA_FILE = './sql/insert.sql';
const DROP_SCHEMA_FILE = './sql/drop.sql';

const { DATABASE_URL: connectionString, NODE_ENV: nodeEnv = 'development' } =
  process.env;

if (!connectionString) {
  console.error('vantar DATABASE_URL í .env');
  process.exit(-1);
}

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development
// mode, á heroku, ekki á local vél
const ssl = nodeEnv === 'production' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

export async function query(q, values) {
  let client;

  try {
    client = await pool.connect();
  } catch (e) {
    console.error('Unable to connect', e);
    return null;
  }

  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    console.error('Error running query', e);
    return null;
  } finally {
    client.release();
  }
}

export async function singleQuery(_query, values = []) {
  const result = await query(_query, values);

  if (result.rows && result.rows.length === 1) {
    return result.rows[0];
  }

  return null;
}

export async function deleteQuery(_query, values = []) {
  const result = await query(_query, values);

  return result.rowCount;
}

// TODO: raða eftir dagsetningum
export async function listProducts(req, res){

  const products = await query(`
    SELECT * FROM products;`
  );

  return res.json(products.rows);
}

export async function listCategories(req, res){

  const categories = await query(`
    SELECT * FROM categories`
  );

  return res.json(categories.rows);
}

export async function createCategory(req, res) {
  const {
    title
  } = req.body;

  try {
    const createdCategory = await singleQuery(
      `
      INSERT INTO categories
        (title)
      VALUES
        ($1)
      RETURNING id, title;
    `,
      [xss(title)]
    );
    return res.status(201).json(createdCategory);
  } catch (e) {
    console.error('gat ekki búið til flokk', e);
  }
  return res.status(500).json(null);
}

//TODO: tengja image url við cloudinary.. og tryggja að image sé rétt type(image er character í db?)
export async function createProduct(req, res) {
  const {
    title, price, description, image, category
  } = req.body;

  try {
    const createdProduct = await singleQuery(
      `
      INSERT INTO products
        (title, price, description, image, category)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING id, title, price, description, image, category;
    `,
      [xss(title), xss(price), xss(description), xss(image), xss(category)]
    );
    return res.status(201).json(createdProduct);
  } catch (e) {
    console.error('gat ekki búið til vöru', e);
  }
  return res.status(500).json(null);
}

export async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const deletionRowCount = await deleteQuery(
      'DELETE FROM products WHERE id = $1;', [id],
    );

    if (deletionRowCount === 0) {
      return res.status(404).end();
    }

    return res.status(200).json({});
  } catch (e) {
    console.error(`gat ekki eytt vöru`, e);
  }
  return res.status(500).json(null);
}

export async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const deletionRowCount = await deleteQuery(
      'DELETE FROM categories WHERE id = $1;', [id],
    );

    if (deletionRowCount === 0) {
      return res.status(404).end();
    }

    return res.status(200).json({});
  } catch (e) {
    console.error(`gat ekki eytt flokk`, e);
  }
  return res.status(500).json(null);
}

export async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir id');
  }

  return null;
}

export async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result;
}

export async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  try {
    const result = await query(q, [username]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir notendnafni');
    return null;
  }

  return false;
}

export async function createSchema(schemaFile = SCHEMA_FILE) {
  const data = await readFile(schemaFile);

  return query(data.toString('utf-8'));
}

export async function dropSchema(dropFile = DROP_SCHEMA_FILE) {
  const data = await readFile(dropFile);

  return query(data.toString('utf-8'));
}

export async function end() {
  await pool.end();
}
