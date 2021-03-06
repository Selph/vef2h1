import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { findById } from '../db.js';

/**
 * Passport stillingar og middleware til að athuga hvort notandi sé innsrkáður
 * og/eða stjórnandi.
 */

export const {
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 3600,
} = process.env;

if (!jwtSecret) {
  console.error('Vantar .env gildi');
  process.exit(1);
}

async function strat(data, next) {
  // fáum id gegnum data sem geymt er í token
  const user = await findById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

export function requireAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info.name === 'TokenExpiredError'
          ? 'expired token' : 'invalid token';

        return res.status(401).json({ error });
      }

      // Látum notanda vera aðgengilegan í rest af middlewares
      req.user = user;
      return next();
    },
  )(req, res, next);
}

export function requireNotSelf(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    async (err, user) => {
      if (err) {
        return next(err);
      }

      const userInfo = await findById(req.params.id);

      if (user.id === userInfo.id) {
        const error = 'user cannot change his own admin privileges';
        return res.status(401).json({ error });
      }

      // Látum notanda vera aðgengilegan í rest af middlewares
      req.user = user;
      return next();
    },
  )(req, res, next);
}

export function requireSameUser(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    async (err, user) => {
      if (err) {
        return next(err);
      }

      const userInfo = await findById(req.params.id);

      if (user.id !== userInfo.id) {
        const error = 'user cannot change other users data';
        return res.status(401).json({ error });
      }

      // Látum notanda vera aðgengilegan í rest af middlewares
      req.user = user;
      return next();
    },
  )(req, res, next);
}

export function addUserIfAuthenticated(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user) => {
      if (err) {
        return next(err);
      }

      if (user) {
        req.user = user;
      }

      return next();
    },
  )(req, res, next);
}

// TODO too much replication from above
export function requireAdmin(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info.name === 'TokenExpiredError'
          ? 'expired token' : 'invalid token';
        return res.status(401).json({ error });
      }

      if (!user.admin) {
        const error = 'insufficient authorization';
        return res.status(401).json({ error });
      }

      // Látum notanda vera aðgengilegan í rest af middlewares
      req.user = user;
      return next();
    },
  )(req, res, next);
}

export const tokenOptions = { expiresIn: parseInt(tokenLifetime, 10) };

export const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(new Strategy(jwtOptions, strat));

export default passport;
