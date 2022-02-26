# Vefforritun 2, 2022. Hópverkefni 1: Veitingastaðurinn RFC

## Setup

Keyrt með:

```bash
npm install
createdb vef2h1
# setja rétt DATABASE_URL í .env
npm run setup
npm run dev
```

Uppsetning á heroku, gefið að appið sé til undir nafninu <APP> og þú sért loggedin á heroku cli:

```bash
heroku git:remote -a <APP>
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run npm run setup
```

## Skipanir

Til að athuga hvort test séu rétt útfærð keyra test og fyrir eslint keyra lint

```bash
npm run test
npm run lint
```

## Tæki og tól

### Dependencies

```
bcrypt
dotenv
dotenv-cli
express
express-validator
passport
passport-jwt
passport-local
pg
xss
```

### Dev dependencies

```concurrently
eslint
eslint-config-airbnb-base
eslint-config-prettier
eslint-plugin-import
jest
node-fetch
nodemon
```

## Admin aðgangur

notendanafn: `admin`
lykilorð:    `1234`

## env skrár

Það þarf að setja réttar upplýsingar í .env og .env.test skrárnar:

```
DATABASE_URL
JWT_SECRET
TOKEN_LIFETIME
```

## Heroku

https://vef2h1-rfc.herokuapp.com

> Útgáfa 0.4

| Útgáfa | Breyting      |
| ------ | ------------- |
| 0.1    | Bæta Readme   |
| 0.2    | Base files    |
| 0.3    | Database      |
| 0.4    | Users         |
