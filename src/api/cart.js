import express from 'express';
import { query } from '../db.js';
import { catchErrors } from '../utils/catch-errors.js';
import { validationCheck } from '../validation/helper.js';

export const router = express.Router();

async function getCartId(req,res) {

  const { cartid } = req.params;
  console.log(cartid)

  const cartQuery = `
  SELECT
    *
  FROM
    basket_items
  WHERE
    uid=$1
  `;

  const cart = await query(
    cartQuery,
    [cartid],
  );

  return res.json(cart.rows);
}

router.get('/:cartid',
            validationCheck,
            catchErrors(getCartId))
