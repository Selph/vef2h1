import express from 'express';
import { join } from 'path';
import { requireAdmin } from '../auth/passport.js';
import { pagingQuerystringValidator } from '../validation/validators.js';
import { pagedQuery } from '../db.js';
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

router.get('/',
          requireAdmin,
          pagingQuerystringValidator,
          validationCheck,
          catchErrors(listOrders))
