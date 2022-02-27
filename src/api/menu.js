import express from 'express';
import { join } from 'path';
import { catchErrors } from '../utils/catch-errors.js';
import { query as dbQuery, pagedQuery, conditionalUpdate} from '../db.js';
import cloudinary from 'cloudinary';
import { addPageMetadata } from '../utils/addPageMetadata.js';
import { validationCheck } from '../validation/helper.js';
import { isInt,
         isNotEmptyString,
         isString,
         pagingQuerystringValidator,
         validateImageMimetype,
         validateProduct } from '../validation/validators.js';
import { requireAdmin, requireAuthentication } from '../auth/passport.js';
import xss from 'xss';
import { withMulter } from '../utils/multer.js';
import { MIMETYPES } from '../validation/validators.js';
import { toPositiveNumberOrDefault } from '../utils/toPositiveNumberOrDefault.js';


export const router = express.Router();

async function listProducts(req, res) {
  const { offset = 0, limit = 10, search = '', category = '' } = req.query;

  let where = '';
  let values = [];

  const hasSearch = isNotEmptyString(search);
  const hasCategory = isInt(category) && category > 0;

  // Búum til dýnamískt query eftir því hvort search eða category sent inn
  if (hasSearch || hasCategory) {
    const sparam = hasSearch ? '$1' : '';
    const cparam = hasSearch ? '$2' : '$1';

    const parts = [
      hasSearch ?
        `(
          to_tsvector('english', p.title) @@
          plainto_tsquery('english', ${sparam})
          OR
          to_tsvector('english', p.description) @@
          plainto_tsquery('english', ${sparam})
        )` : null,
      hasCategory ?
        `p.category = ${cparam}` : null,
    ].filter(Boolean);

    where = `WHERE ${parts.join(' AND ')}`;
    values = [
      hasSearch ? search : null,
      hasCategory ? category : null,
    ].filter(Boolean);
  }

  const q = `
    SELECT
      p.id, p.title, p.price, p.description, p.image, p.created, p.updated,
      p.category, c.title as category_title
    FROM
      products AS p
    LEFT JOIN
      categories AS c
    ON
      p.category = c.id
    ${where}
    ORDER BY
      p.updated DESC`;

  const products = await pagedQuery(
    q,
    values,
    { offset, limit },
  );

  const productsWithPage = addPageMetadata(
    products,
    join('/menu', req.path),
    { offset, limit, length: products.items.length },
  );

  return res.json(productsWithPage);
}

async function createProductWithImage(req, res, next) {
  const { title, price, description, category } = req.body;

  // file er tómt ef engri var uploadað
  const { file: { path, mimetype } = {} } = req;

  const hasImage = Boolean(path && mimetype);

  const product = { title, price, description, category };

  const validations = await validateProduct(product);

  if (hasImage) {
    if (!validateImageMimetype(mimetype)) {
      validations.push({
        field: 'image',
        error: `Mimetype ${mimetype} is not legal. ` +
               `Only ${MIMETYPES.join(', ')} are accepted`,
      });
    }
  }

  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  // Aðeins ef allt er löglegt uploadum við mynd
  if (hasImage) {
    let upload = null;
    try {
      upload = await cloudinary.uploader.upload(path);
    } catch (error) {
      // Skilum áfram villu frá Cloudinary, ef einhver
      if (error.http_code && error.http_code === 400) {
        return res.status(400).json({ errors: [{
          field: 'image',
          error: error.message,
        }] });
      }

      console.error('Unable to upload file to cloudinary');
      return next(error);
    }

    if (upload && upload.secure_url) {
      product.image = upload.secure_url;
    } else {
      // Einhverja hluta vegna er ekkert `secure_url`?
      return next(new Error('Cloudinary upload missing secure_url'));
    }
  }

  const q = `
    INSERT INTO
      products
      (title, price, description, category, image)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING id, title, price, description, category, image
  `;

  const values = [
    xss(product.title),
    xss(product.price),
    xss(product.description),
    xss(product.category),
    xss(product.image),
  ];

  const result = await dbQuery(q, values);

  return res.status(201).json(result.rows[0]);
}

async function createProduct(req, res, next) {
  return withMulter(req, res, next, createProductWithImage);
}

async function getProduct(id) {
  if (!isInt(id)) {
    return null;
  }

  const q = `
    SELECT
      p.id, p.title, p.price, p.description, p.image, p.created, p.category,
      c.title as category_title
    FROM
      products AS p
    LEFT JOIN
      categories AS c
    ON
      p.category = c.id
    WHERE
      p.id = $1`;

  const category = await dbQuery(
    q,
    [id],
  );

  if (category.rows.length !== 1) {
    return null;
  }

  return category.rows[0];
}

async function listProduct(req, res) {
  const { id } = req.params;

  const product = await getProduct(id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.json(product);
}

async function updateProductWithImage(req, res, next) {
  const { id } = req.params;
  const { title, price, description, category } = req.body;

  // file er tómt ef engri var uploadað
  const { file: { path, mimetype } = {} } = req;

  const hasImage = Boolean(path && mimetype);

  const product = { title, price, description, category };

  const validations = await validateProduct(product, true, id);

  if (hasImage) {
    if (!validateImageMimetype(mimetype)) {
      validations.push({
        field: 'image',
        error: `Mimetype ${mimetype} is not legal. ` +
               `Only ${MIMETYPES.join(', ')} are accepted`,
      });
    }
  }

  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  // Aðeins ef allt er löglegt uploadum við mynd
  if (hasImage) {
    let upload = null;
    try {
      upload = await cloudinary.uploader.upload(path);
    } catch (error) {
      // Skilum áfram villu frá Cloudinary, ef einhver
      if (error.http_code && error.http_code === 400) {
        return res.status(400).json({ errors: [{
          field: 'image',
          error: error.message,
        }] });
      }

      console.error('Unable to upload file to cloudinary');
      return next(error);
    }

    if (upload && upload.secure_url) {
      product.image = upload.secure_url;
    } else {
      // Einhverja hluta vegna er ekkert `secure_url`?
      return next(new Error('Cloudinary upload missing secure_url'));
    }
  }

  const fields = [
    isString(product.title) ? 'title' : null,
    isString(product.price) ? 'price' : null,
    isString(product.description) ? 'description' : null,
    isString(product.category) ? 'category_id' : null,
    isString(product.image) ? 'image' : null,
  ];

  const values = [
    isString(product.title) ? xss(product.title) : null,
    isString(product.price) ? xss(product.price) : null,
    isString(product.description) ? xss(product.description) : null,
    isString(product.category) ? xss(product.category) : null,
    isString(product.image) ? xss(product.image) : null,
  ];

  if (!fields.filter(Boolean).length === 0) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  // update updated if updating updates
  fields.push('updated');
  values.push(new Date());

  const result = await conditionalUpdate('products', id, fields, values);

  return res.status(201).json(result.rows[0]);
}

async function updateProduct(req, res, next) {
  return withMulter(req, res, next, updateProductWithImage);
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  const product = await getProduct(id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Athuga hvort vara sé til í körfu/pöntun
  const countQuery = 'SELECT COUNT(*) FROM order_items WHERE product_id = $1';
  const countResult = await dbQuery(countQuery, [id]);

  const { count } = countResult.rows[0];

  // Leyfum bara að eyða tómum flokkum
  if (toPositiveNumberOrDefault(count, 0) > 0) {
    return res.status(400).json({
      error: 'Product exists in cart or order, cannot delete.',
    });
  }

  const q = 'DELETE FROM products WHERE ID = $1';
  await dbQuery(q, [id]);

  return res.status(204).json({});
}

router.get('/', pagingQuerystringValidator, validationCheck, catchErrors(listProducts));
router.post('/:id/:image', requireAuthentication,
                           requireAdmin,
                           catchErrors(createProduct));
router.get('/:id', catchErrors(listProduct));
router.patch('/:id', requireAdmin, catchErrors(updateProduct));
router.delete('/:id', requireAdmin, catchErrors(deleteProduct));
