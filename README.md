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

Til að athuga hvort test séu rétt útfærð keyra coverage, fyrir eslint og stylelint keyra lint

```bash
npm run coverage
npm run lint
```

## Tæki og tól

### Dependencies

`bcrypt`
`cookie-parser`
`dotenv`
`dotenv-cli`
`ejs`
`express`
`express-session`
`express-validator`
`passport`
`passport-local`
`pg`
`xss`

### Dev dependencies

`concurrently`
`eslint`
`eslint-config-airbnb-base`
`eslint-config-prettier`
`eslint-plugin-import`
`jest`
`nodemon`
`prettier`
`stylelint`
`stylelint-config-sass-guidelines`
`stylelint-config-standard`

## Admin aðgangur

notendanafn: `admin`
lykilorð:    `1234`

## env skrár

Það þarf að setja réttar upplýsingar í .env.test skrárnar

## Heroku

https://vef2h1-rfc.herokuapp.com

> Útgáfa 0.3

| Útgáfa | Breyting      |
| ------ | ------------- |
| 0.1    | Bæta Readme   |
| 0.2    | Base files    |
| 0.3    | Database      |
