import { readFile } from 'fs/promises';
// eslint-disable-next-line import/no-unresolved
import bcrypt from 'bcrypt';
import pg from 'pg';
import xss from 'xss';
import { toPositiveNumberOrDefault } from './utils/toPositiveNumberOrDefault.js';

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

export async function pagedQuery(
  sqlQuery,
  values = [],
  { offset = 0, limit = 10 } = {},
) {
  const sqlLimit = values.length + 1;
  const sqlOffset = values.length + 2;
  const q = `${sqlQuery} LIMIT $${sqlLimit} OFFSET $${sqlOffset}`;

  const limitAsNumber = toPositiveNumberOrDefault(limit, 10);
  const offsetAsNumber = toPositiveNumberOrDefault(offset, 0);

  const combinedValues = values.concat([limitAsNumber, offsetAsNumber]);

  const result = await query(q, combinedValues);

  return {
    limit: limitAsNumber,
    offset: offsetAsNumber,
    items: result.rows,
  };
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

export async function listCategories(req, res){

  const categories = await query(`
    SELECT * FROM categories`
  );

  return res.json(categories.rows);
}

export async function listCategory(req, res) {
  const { id } = req.params;

  const category = await singleQuery(
    'SELECT id, title FROM categories WHERE id = $1',
    [id],
  );

  if (!category) {
    return res.status(404).json({ error: 'Flokkur fannst ekki' });
  }

  return res.json(category);
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
    console.error('gat ekki eytt flokk', e);
  }
  return res.status(500).json(null);
}

export async function updateCategory(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  const category = await singleQuery(
    'SELECT id, title FROM categories WHERE id = $1',
    [id],
  );

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }


  const q = `
    UPDATE
      categories
    SET title = $1, updated = current_timestamp
    WHERE id = $2
    RETURNING id, title`;
  const result = await query(q, [xss(title), id]);

  return res.status(201).json(result.rows[0]);
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

export async function conditionalUpdate(table, id, fields, values) {
  const filteredFields = fields.filter((i) => typeof i === 'string');
  const filteredValues = values
  .filter((i) => typeof i === 'string'
  || typeof i === 'number'
  || i instanceof Date);
  if (filteredFields.length === 0) {
  return false;
  }
  if (filteredFields.length !== filteredValues.length) {
  throw new Error('fields and values must be of equal length');
  }
  // id is field = 1
  const updates = filteredFields.map((field, i) => `${field} = $${i + 2}`);
  const q = `
      UPDATE ${table}
        SET ${updates.join(', ')}
      WHERE
        id = $1
      RETURNING *
      `;
  const queryValues = [id].concat(filteredValues);
  console.info('Conditional update', q, queryValues);
  const result = await query(q, queryValues);
  return result;
}

export async function end() {
  await pool.end();
}
