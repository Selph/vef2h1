import express from 'express';
import { catchErrors } from '../utils/catch-errors.js';
import {
  listProducts,
  createProduct,
  deleteProduct } from '../db.js';


export const router = express.Router();

// TODO: notendaumsjón!
router.get('/menu', catchErrors(listProducts));
router.post('/menu', catchErrors(createProduct));
router.delete('/menu/:id', catchErrors(deleteProduct));
