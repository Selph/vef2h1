import express from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import { listCategories, listProducts } from '../lib/db.js';


export const indexRouter = express.Router();

async function indexRoute(req, res) {
  const categories = await listCategories();
  const products = await listProducts();

  res.render('index', {
    title: 'Matseðill',
    categories,
    products,
  });
}

indexRouter.get('/', catchErrors(indexRoute))
