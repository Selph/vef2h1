import express from 'express';
import { catchErrors } from '../utils/catch-errors.js';
import {
  listCategories,
  createCategory,
  deleteCategory } from '../db.js';

export const router = express.Router();

router.get('/', catchErrors(listCategories));
router.post('/', catchErrors(createCategory));
router.delete('/:id', catchErrors(deleteCategory));
