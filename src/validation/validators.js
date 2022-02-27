import { body, param, query } from 'express-validator';
import { comparePasswords, findByUsername, query as dbQuery } from '../db.js';
import { LoginError } from '../errors.js';
import { toPositiveNumberOrDefault } from '../utils/toPositiveNumberOrDefault.js';
import { resourceExists } from './helper.js';


export function isEmpty(s) {
  return s != null && !s;
}

export function isInt(i) {
  return i !== '' && Number.isInteger(Number(i));
}

export function isString(s) {
  return typeof s === 'string';
}

export function isBoolean(b) {
  return typeof b === 'boolean';
}

function lengthValidationError(s, min, max) {
  const length = s && s.length ? s.length : 'undefined';

  const minMsg = min ? `at least ${min} characters` : '';
  const maxMsg = max ? `at most ${max} characters` : '';
  const msg = [minMsg, maxMsg].filter(Boolean).join(', ');
  const lenMsg = `Current length is ${length}.`;

  return `Must be non empty string ${msg}. ${lenMsg}`;
}

export function isNotEmptyString(s, { min = undefined, max = undefined } = {}) {
  if (typeof s !== 'string' || s.length === 0) {
    return false;
  }

  if (max && s.length > max) {
    return false;
  }

  if (min && s.length < min) {
    return false;
  }

  return true;
}

export const pagingQuerystringValidator = [
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('query parameter "offset" must be an int, 0 or larget'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('query parameter "limit" must be an int, larger than 0'),
];

export const isPatchingAllowAsOptional = (value, { req }) => {
  if (!value && req.method === 'PATCH') {
    return false;
  }

  return true;
};

export function validateResourceExists(fetchResource) {
  return [
    param('id')
      .custom(resourceExists(fetchResource))
      .withMessage('not found'),
  ];
}

export function validateResourceNotExists(fetchResource) {
  return [
    param('id')
      .not()
      .custom(resourceExists(fetchResource))
      .withMessage('already exists'),
  ];
}

export const usernameValidator = body('username')
  .if(isPatchingAllowAsOptional)
  .isLength({ min: 1, max: 256 })
  .withMessage('username is required, max 256 characters');

export const nameValidator = body('name')
  .if(isPatchingAllowAsOptional)
  .isLength({ min: 1, max: 256 })
  .withMessage('name is required, max 256 characters');


export const passwordValidator = body('password')
  .if(isPatchingAllowAsOptional)
  .isLength({ min: 3, max: 256 })
  .withMessage('password is required, min 3 characters, max 256 characters');

export const emailValidator = body('email')
  .if(isPatchingAllowAsOptional)
  .isLength({ min: 1, max: 256 })
  .isEmail()
  .withMessage('email is required, max 256 characters');

export const titleValidator = body('title')
  .if(isPatchingAllowAsOptional)
  .isLength({ min: 1, max: 64 })
  .withMessage('title must be at least 1 character and at most 64 characters')

export const priceValidator = body('price')
  .if(isPatchingAllowAsOptional)
  .isInt({ min: 0 })
  .withMessage('price must be an integer larger or equal to 0')

export const descriptionValidator = body('description')
  .if(isPatchingAllowAsOptional)
  .isString({ min: 1, max: 400})
  .withMessage('description must be a string of at least 1 characters length and at most 400');

export const categoryValidator = body('price')
  .if(isPatchingAllowAsOptional)
  .isInt({ min: 1 })
  .withMessage('category must be an integer larger than 0')

export const MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
];

export function validateImageMimetype(mimetype) {
  return MIMETYPES.indexOf(mimetype.toLowerCase()) >= 0;
}

export const imageValidator = body('image')
  .custom(async (image, { req = {} }) => {
    const { file: { path, mimetype } = {} } = req;

    if (!path && !mimetype && req.method === 'PATCH') {
      return Promise.resolve();
    }

    if (!path && !mimetype) {
      return Promise.reject(new Error('image is required'));
    }

    if (!validateImageMimetype(mimetype)) {
      const error = `Mimetype ${mimetype} is not legal. `
        + `Only ${MIMETYPES.join(', ')} are accepted`;
      return Promise.reject(new Error(error));
    }

    return Promise.resolve();
  });

export const usernameDoesNotExistValidator = body('username')
  .custom(async (username) => {
    const user = await findByUsername(username);

    if (user) {
      return Promise.reject(new Error('username already exists'));
    }
    return Promise.resolve();
  });

export const usernameAndPaswordValidValidator = body('username')
  .custom(async (username, { req: { body: reqBody } = {} }) => {
    // Can't bail after username and password validators, so some duplication
    // of validation here
    // TODO use schema validation instead?
    const { password } = reqBody;

    if (!username || !password) {
      return Promise.reject(new Error('skip'));
    }

    let valid = false;
    try {
      const user = await findByUsername(username);
      valid = await comparePasswords(password, user.password);
    } catch (e) {
      // Here we would track login attempts for monitoring purposes
      // logger.info(`invalid login attempt for ${username}`);
    }

    if (!valid) {
      return Promise.reject(new LoginError('username or password incorrect'));
    }
    return Promise.resolve();
  });

export const validationUser = [
  nameValidator,
  usernameValidator,
  passwordValidator,
  emailValidator
]

export const validationProduct = [
  titleValidator,
  priceValidator,
  descriptionValidator,
  imageValidator,
  categoryValidator,
]

export function atLeastOneBodyValueValidator(fields) {
  return body()
    .custom(async (value, { req }) => {
      const { body: reqBody } = req;

      let valid = false;

      for (let i = 0; i < fields.length; i += 1) {
        const field = fields[i];

        if (field in reqBody && reqBody[field] != null) {
          valid = true;
          break;
        }
      }

      if (!valid) {
        return Promise.reject(new Error(`require at least one value of: ${fields.join(', ')}`));
      }
      return Promise.resolve();
    });
}

export async function validateProduct(
  { title, price, description, category } = {},
  patching = false,
  id = null,
) {
  const validation = [];

  if (!patching || title || isEmpty(title)) {
    if (!isNotEmptyString(title, { min: 1, max: 256 })) {
      validation.push({
        field: 'title',
        error: lengthValidationError(title, 1, 256),
      });
    }

    const titleExists = await dbQuery(
      'SELECT id FROM products WHERE title = $1',
      [title],
    );

    if (titleExists.rows.length > 0) {
      const current = titleExists.rows[0].id;

      if (patching && id && current === toPositiveNumberOrDefault(id, 0)) {
        // we can patch our own title
      } else {
        const error = `Title already exists in product with id ${current}.`;
        validation.push({
          field: 'title',
          error,
        });
      }
    }
  }

  if (!patching || price || isEmpty(price)) {
    if (toPositiveNumberOrDefault(price, 0) <= 0) {
      validation.push({
        field: 'price',
        error: 'Price must be a positive integer',
      });
    } else if (toPositiveNumberOrDefault(price, 0) > 2147483647) {
      validation.push({
        field: 'price',
        error: 'Price can not be higher than 2147483647',
      });
    }
  }

  if (!patching || description || isEmpty(description)) {
    if (!isNotEmptyString(description, { min: 1 })) {
      validation.push({
        field: 'description',
        error: lengthValidationError(description, 1),
      });
    }
  }

  if (!patching || category || isEmpty(category)) {
    let categoryInvalid = false;

    if (toPositiveNumberOrDefault(category, 0) > 2147483647) {
      categoryInvalid = true;
    } else if (toPositiveNumberOrDefault(category, 0) > 0) {
      const cat = await dbQuery(
        'SELECT id FROM categories WHERE id = $1',
        [category],
      );

      if (cat.rows.length !== 1) {
        categoryInvalid = true;
      }
    } else {
      categoryInvalid = true;
    }

    if (categoryInvalid) {
      validation.push({
        field: 'category',
        error: 'Category does not exist',
      });
    }
  }

  return validation;
}

