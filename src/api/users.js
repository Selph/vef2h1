import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import xss from 'xss';
import { jwtOptions,
         requireAdmin,
         requireAuthentication,
         requireNotSelf,
         requireSameUser,
         tokenLifetime } from '../auth/passport.js';
import { comparePasswords, findByUsername, query } from '../db.js';
import { sanitation } from '../validation/sanitation.js';
import { validationUser } from '../validation/validators.js';
import { validationCheck } from '../validation/helper.js';
import { catchErrors } from '../utils/catch-errors.js';
import { findById, conditionalUpdate } from '../db.js';
import { isString } from '../utils/misc.js';

export const router = express.Router();


async function listUsers(req, res) {
  const userQuery = 'select id, name, username, email, admin from users';
  const users = await query(userQuery);
  return res.json(users.rows);
}

async function getUser(req, res) {
  const userQuery = 'select id, name, username, email, admin from users where id=$1';
  const params = [req.params.id]
  const users = await query(userQuery, params);

  return res.json(users.rows);
}

async function getMyUser(req,res) {
  const userQuery = 'select id, email from users where id=$1';
  const params = [req.params.id]
  const users = await query(userQuery, params);

  const { email } = users.rows[0];

  const payload = { id: users.rows.id };
  const tokenOptions = { expiresIn: tokenLifetime };
  const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);

  return res.json({ token, email });
}

async function registerUser(req, res) {
  const getUserQuery = 'select * from users where username=$1';
  const paramsUser = [req.body.username];
  const user = await query(getUserQuery, paramsUser);

  if (user.rowCount > 0) return res.status(500).json({ error: 'user already exists' });

  const getEmailQuery = 'select * from users where email=$1';
  const paramsEmail = [req.body.email];
  const emails = await query(getEmailQuery, paramsEmail);

  if (emails.rowCount > 0) return res.status(500).json({ error: 'email already exists' });

  const userQuery = 'insert into users(name, username, password, email) values($1, $2, $3, $4)';
  const hashedPassword = await bcrypt.hash(req.body.password, 11);
  const body = [req.body.name, req.body.username, hashedPassword, req.body.email];
  const registered = { registered: await query(userQuery, body),
                             user: await query(getUserQuery, paramsUser) };

  const { email } = registered.user.rows[0];

  const payload = { id: registered.user.id };
  const tokenOptions = { expiresIn: tokenLifetime };
  const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);

  return res.json({ token, email });
}

async function login(req, res) {
  const { username, password = '' } = req.body;

  const user = await findByUsername(username);

  if (!user) {
    return res.status(401).json({ error: 'No such user'  });
  }

  const passwordIsCorrect = await comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid password' });
}

async function changeAdmin(req, res) {
  const adminQuery = 'SELECT admin FROM users WHERE id=$1';
  const params = [req.params.id];
  const result = await query(adminQuery, params);

  let toggle = true;
  if (result.rows[0].admin) toggle = false;

  const userQuery = `UPDATE users SET admin=${toggle} WHERE id=$1`
  const resultUser = await query(userQuery, params);

  if (!resultUser) return res.json({ error: 'unknown error' })
  return res.json({ message: 'success'});
}

async function getUserFromToken(req, res, next) {
  req.params.id = req.user.id;
  return next();
}

const patchUser = async (req,res) => {
  const theUser = await findById(req.params.id)
  if (theUser.id === null) return res.status(500).json({error: 'no user found'});

  const { id } = req.params;
  const { body } = req;

  const fields = [
    isString(body.email) ? 'email' : null,
    isString(body.password) ? 'password' : null,
  ];

  const values = [
    isString(body.email) ? xss(body.email) : null,
    isString(body.password) ? xss(body.password) : null,
  ];

  const result = await conditionalUpdate('users', id, fields, values);

  if (!result || !result.rows[0]) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  return res.status(200).json(result.rows[0]);
}


router.get('/', requireAuthentication, requireAdmin, catchErrors(listUsers));
router.get('/me', requireAuthentication, getUserFromToken, catchErrors(getMyUser));
router.patch('/me', requireAuthentication,
                    getUserFromToken,
                    requireSameUser,
                    validationUser,
                    validationCheck,
                    sanitation,
                    patchUser);
router.get('/:id', requireAuthentication, requireAdmin, catchErrors(getUser));
router.patch('/:id', requireAuthentication, requireAdmin, requireNotSelf, catchErrors(changeAdmin));
router.post('/register', validationUser,
                         validationCheck,
                         sanitation,
                         registerUser);
router.post('/login', catchErrors(login));
