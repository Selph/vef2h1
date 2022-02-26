import { body } from 'express-validator';
import xss from 'xss';
import { isPatchingAllowAsOptional } from './validators.js';

export const sanitation = [
  body('name').if(isPatchingAllowAsOptional).trim().escape(),
  body('name').if(isPatchingAllowAsOptional).customSanitizer((value) => xss(value)),
  body('username').if(isPatchingAllowAsOptional).customSanitizer((value) => xss(value)),
  body('password').if(isPatchingAllowAsOptional).customSanitizer((value) => xss(value)),
  body('email').if(isPatchingAllowAsOptional).customSanitizer((value) => xss(value)),
]
