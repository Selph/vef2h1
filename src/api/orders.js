import express from 'express';
import { join } from 'path';
import patch from 'express-ws/lib/add-ws-method.js';
import { requireAdmin } from '../auth/passport.js';
import { nameValidator, pagingQuerystringValidator } from '../validation/validators.js';
import { pagedQuery, query } from '../db.js';
import { validationCheck } from '../validation/helper.js';
import { catchErrors } from '../utils/catch-errors.js';
import { addPageMetadata } from '../utils/addPageMetadata.js';

export const router = express.Router();

patch.default(express.Router);
const wsConnection = new Map();

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

async function listOrder(req, res) {
  const { id } = req.params;

  const q = `
  SELECT * FROM order_items
  WHERE uid=$1
  `;

  const order = await query(`
    SELECT o.uid, o.name, o.created, s.uid, s.status
    FROM orders o, order_status s
    WHERE o.uid = s.uid AND o.uid = $1
    `,
    [id]
  );

  const items = await query(q,[id])

  if (!order) {
    return res.status(404).json({ error: 'order not found' });
  }

  return res.json({ order: order.rows[0], items: items.rows });
}

async function getOrderStatus (req, res) {
  const { id } = req.params;

  const status = await query(
    'SELECT status, updated FROM order_status WHERE uid = $1',
    [id],
  );

  if (!status) {
    return res.status(404).json({ error: 'order not found' });
  }

  return res.json(status.rows[0]);
}

async function updateStatus(req, res) {
  const { id } = req.params;
  const status = await query('SELECT status FROM order_status WHERE uid=$1',[id])

  let stage = null;
  switch(status.rows[0].status){
    case 'NEW':
      stage = 'PREPARE';
      break;
    case 'PREPARE':
      stage = 'COOKING';
      break;
    case 'COOKING':
      stage = 'READY';
      break;
    case 'READY':
      stage = 'FINISHED';
      break;
    case 'FINISHED':
      stage = 'FINISHED';
      break;
    default:
      stage = 'NEW'
      break;
  }
  const q = `
  UPDATE order_status
    SET
      status= $1
  WHERE
    uid=$2
  RETURNING status
  `;

  const result = await query(q, [stage, id]);

  if(result) {
    const connection = wsConnection.get(id);
    if (connection) {
      connection.forEach(ws => {
        ws.send(JSON.stringify(result.rows));
      });
    }
    return res.status(200).json(result.rows[0]);

  }

  return res.status(404).json({ error: 'order not found'});
}

async function webSocketConnection(ws, req) {
  const { id } = req.params;

  wsConnection.set(id, new Set());
  const newConnection = wsConnection.get(id);
  newConnection.add(ws);
  wsConnection.set(id, newConnection);
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
router.get('/:id/status', catchErrors(getOrderStatus));
router.post('/:id/status', requireAdmin, catchErrors(updateStatus));
router.ws('/:id', webSocketConnection);
