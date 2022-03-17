import express from 'express';
import { join } from 'path';
import { requireAdmin } from '../auth/passport.js';
import { nameValidator, pagingQuerystringValidator } from '../validation/validators.js';
import { pagedQuery, query, singleQuery } from '../db.js';
import { validationCheck } from '../validation/helper.js';
import { catchErrors } from '../utils/catch-errors.js';
import { addPageMetadata } from '../utils/addPageMetadata.js';

export const router = express.Router();

async function listOrders(req,res) {
  const { offset = 0, limit = 10 } = req.query;

  const orderQuery = `
    SELECT
      uid, created, name
    FROM
      orders
    ORDER BY created DESC
    `;

  const orders = await pagedQuery(orderQuery, [], { offset, limit });

  const ordersWithPage = addPageMetadata(
    orders,
    join('/orders', req.path),
    { offset, limit, length: orders.items.length },
  );

  return res.json(ordersWithPage);
}

async function createOrder(req, res) {
  const { uid, name } = req.body;

  const q = `
  INSERT INTO
    orders
    (uid, name)
  VALUES
    ($1,$2)
  RETURNING uid,name
  `;

  const resultQ = await query(q,[uid,name]);

  if(resultQ) {
    const w = `
    INSERT INTO order_items
    SELECT * FROM basket_items
    WHERE basket_items.uid = $1
    `;

   await query(w, [uid]);

    const e = `
    INSERT INTO order_status
      (uid, status)
    VALUES
      ($1,$2)
    RETURNING uid,status
    `;

    const resultE = await query(e, [uid,'NEW'])

    return res.status(201).json(resultE.rows[0])
  }

  return res.status(404).json({error: 'basket not found'})
}

async function listOrder( req, res) {
  const { id } = req.params;

  const order = await query(
    'SELECT o.uid, o.name, o.created, i.uid, i.product_id, i.amount, s.uid, s.status FROM orders o, order_items i, order_status s WHERE o.uid = i.uid AND o.uid = s.uid AND o.uid = $1',
    [id],
  );

  if (!order) {
    return res.status(404).json({ error: 'order not found' });
  }

  return res.json(order.rows[0]);
}



router.get('/',
          requireAdmin,
          pagingQuerystringValidator,
          validationCheck,
          catchErrors(listOrders));
router.post('/',
          nameValidator,
          validationCheck,
          catchErrors(createOrder));
router.get('/:id', catchErrors(listOrder));
