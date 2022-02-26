import express from 'express';
import { join } from 'path';
import { catchErrors } from '../utils/catch-errors.js';
import {
  createProduct,
  deleteProduct,
  pagedQuery} from '../db.js';
import { addPageMetadata } from '../utils/addPageMetadata.js';
import { validationCheck } from '../validation/helper.js';
import { pagingQuerystringValidator } from '../validation/validators.js';
import { requireAdmin, requireAuthentication } from '../auth/passport.js';


export const router = express.Router();

async function listProducts(req, res) {

  const { offset = 0, limit = 10 } = req.query;

  const pQuery =
  `SELECT
    *
   FROM
    products
   ORDER BY created DESC`;

  const products = await pagedQuery(pQuery, [], { offset, limit });

  const productsWithPage = addPageMetadata(
    products,
    join(req.path, 'menu'),
    { offset, limit, length: products.items.length },
  );

  return res.json(productsWithPage);
}

// TODO: notendaumsjón!
router.get('/', pagingQuerystringValidator, validationCheck, catchErrors(listProducts));
router.post('/', requireAuthentication,
                 requireAdmin,
                // TODO validationProduct,
                 catchErrors(createProduct));
router.delete('/:id', catchErrors(deleteProduct));
