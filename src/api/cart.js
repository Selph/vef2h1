import express from 'express';
import xss from 'xss';
import { deleteQuery, query } from '../db.js';
import { catchErrors } from '../utils/catch-errors.js';
import { validationCheck } from '../validation/helper.js';
import { amountValidator, productIdValidator } from '../validation/validators.js';

export const router = express.Router();

async function createCart(req, res) {
  const q = `
  INSERT INTO baskets DEFAULT VALUES
  RETURNING uid, created
  `;

  const result = await query(q,[]);

  return res.status(201).json(result.rows);
}


// vantar heildarverð
async function getCartId(req,res) {

  const { cartid } = req.params;

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

async function addToCart(req, res) {
  const { amount, id } = req.body;
  const { cartid } = req.params;

  const q = `
  INSERT INTO basket_items
    (product_id, uid, amount)
  VALUES
    ($1,$2,$3)
  RETURNING id,product_id,uid,amount
  `;

  const result = await query(q,[xss(id),xss(cartid),amount]);

  return res.status(201).json(result.rows[0]);
}

async function deleteCart(req, res) {
  const { cartid } = req.params;

  const q = `
  DELETE FROM basket_items WHERE uid=$1
  `;

  const itemResult = await deleteQuery(q, [cartid]);

  const qq = `
  DELETE FROM baskets WHERE uid=$1
  `;
  const result = await deleteQuery(qq, [cartid]);

  return res.status(200).json({deleted: {baskets: result, items: itemResult}});
}

async function getLine(req, res) {
  const { cartid, id } = req.params;

  const q = `
  SELECT amount, title, price, description, image, category FROM basket_items
  JOIN products ON basket_items.id=products.id AND basket_items.uid=$1 AND products.id=$2
  `;

  const result = await query(q, [cartid, id]);

  if(!result.rows[0]) {
    return res.status(404).json({ error: 'item not found' });
  }
  return res.status(200).json(result.rows);
}

async function updateLine(req, res) {
  const { cartid, id } = req.params;
  const { amount } = req.body;

  const q = `
  UPDATE basket_items
    SET
      amount=$1
  WHERE
    uid=$2 AND id=$3
  RETURNING product_id, amount
  `;

  const result = await query(q, [xss(amount), cartid, id]);

  if(result.rows[0] !== null) {
    return res.status(200).json(result.rows[0]);
  }

  return res.status(400).json({ error: 'Item not found'});
}

async function deleteLine(req, res) {
  const { cartid, id } = req.params;

  const q = `
  DELETE FROM basket_items WHERE uid=$1 AND id=$2
  `;

  const result = await deleteQuery(q, [cartid, id]);

  if(!result) {
    return res.status(404).json({ errors: 'could not delete item'})
  }
  return res.status(200).json({});
}

router.post('/', catchErrors(createCart));
router.get('/:cartid',
            validationCheck,
            catchErrors(getCartId));
router.post('/:cartid',
            amountValidator,
            productIdValidator,
            validationCheck,
            catchErrors(addToCart));
router.delete('/:cartid', catchErrors(deleteCart));
router.get('/:cartid/line/:id', catchErrors(getLine));
router.patch('/:cartid/line/:id',
            amountValidator,
            validationCheck,
            catchErrors(updateLine));
router.delete('/:cartid/line/:id', catchErrors(deleteLine));
