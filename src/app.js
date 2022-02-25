import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { isInvalid } from './lib/template-helpers.js';
import { indexRouter } from './routes/index-routes.js';


dotenv.config();

const app = express();

// Sér um að req.body innihaldi gögn úr formi
app.use(express.urlencoded({ extended: true }));

const {
  PORT: port = 3000,
  DATABASE_URL: databaseUrl,
  // eslint-disable-next-line quotes
  SESSION_SECRET: sessionSecret = `AE"&Q"Q-a{yH8l)X0nY0%S"%gp]InAx$qkvxO^JAr'A(8zykX8BH:GW+)2}3kjY`,
} = process.env;

if (!sessionSecret || !databaseUrl) {
  console.error('Vantar .env gildi');
  process.exit(1);
}

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(passport.initialize());

app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    if (
      req.headers['content-type']
      && (
        req.headers['content-type'] !== 'application/json'
        && !req.headers['content-type'].startsWith('multipart/form-data;')
      )) {
      return res.status(400).json({ error: 'body must be json or form-data' });
    }
  }
  return next();
});


app.use(passport.initialize());
app.use(passport.session());

app.locals = {
  isInvalid,
};

  // TODO Bæta við routes
app.use('/', indexRouter)

/** Middleware sem sér um 404 villur. */
app.use((req, res, next) => { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});


/*
async function strat(username, password, done) {
  try {
    const user = await findByUsername(username);

    if (!user) {
      return done(null, false);
    }

    // Verður annað hvort notandahlutur ef lykilorð rétt, eða false
    const result = await comparePasswords(password, user.password);

    return done(null, result ? user : false);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}

passport.use(new Strategy({
  usernameField: 'username',
  passwordField: 'password',
}, strat));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    return done(null, user);
  } catch (error) {
    return done(error)
  }
});
*/
