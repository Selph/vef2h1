import multer from 'multer';

/**
 * Hjálparfall til að bæta multer við route.
 */

export async function withMulter(req, res, next, fn) {
  multer({ dest: './temp' })
    .single('image')(req, res, (err) => {
      if (err) {
        if (err.message === 'Unexpected field') {
          const errors = [{
            field: 'image',
            error: 'Unable to read image',
          }];
          return res.status(400).json({ errors });
        }

        return next(err);
      }

      return fn(req, res, next).catch(next);
    });
}
