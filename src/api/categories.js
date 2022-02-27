import express from 'express';
import xss from 'xss';
import { catchErrors } from '../utils/catch-errors.js';
import { requireAdmin, requireAuthentication } from '../auth/passport.js';
import {
  singleQuery,
  pagedQuery,
  deleteQuery,
  query, } from '../db.js';

export const router = express.Router();

async function listCategories(req, res){

  const categories = await query(`
    SELECT * FROM categories`
  );

  return res.json(categories.rows);
}

async function listCategory(req, res) {
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

async function createCategory(req, res) {
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


async function deleteCategory(req, res) {
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

async function updateCategory(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  const category = await singleQuery(
    'SELECT id, title FROM categories WHERE id = $1',
    [id],
  );

  if (!category) {
    return res.status(404).json({ error: 'Flokkur fannst ekki' });
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

router.get('/', catchErrors(listCategories));
router.get('/:id', catchErrors(listCategory));
router.post('/', requireAdmin, catchErrors(createCategory));
router.delete('/:id', requireAdmin, catchErrors(deleteCategory));
router.patch('/:id', catchErrors(updateCategory));
