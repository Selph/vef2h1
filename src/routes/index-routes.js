import express from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import {
  listCategories,
  listProducts,
  createProduct,
  createCategory,
  deleteProduct, deleteCategory } from '../lib/db.js';


export const indexRouter = express.Router();

indexRouter.get('/', async (req, res) => res.json({
  menu: '/menu',
  categories: '/categories',
}));

// TODO: notendaumsjón!
indexRouter.get('/menu', catchErrors(listProducts));
indexRouter.get('/categories', catchErrors(listCategories));
indexRouter.post('/categories', catchErrors(createCategory));
indexRouter.post('/menu', catchErrors(createProduct));
indexRouter.delete('/menu/:id', catchErrors(deleteProduct));
indexRouter.delete('/categories/:id', catchErrors(deleteCategory));
