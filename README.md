# Vefforritun 2, 2022. Hópverkefni 1: Veitingastaðurinn RFC

## Umhverfisbreytur

Eftirfarandi breyta er krafist:

* `DATABASE_URL`
  * Slóð á gagnagrunn með auðkenningu
* `CLOUDINARY_URL`
  * Slóð á Cloudinary uppsetningu með auðkenningu
* `JWT_SECRET`
  * Langur, handahófskenndur strengur fyrir leyndarmál sem notað er fyrir JWT token

Eftirfarandi breytur eru valkvæmar:

* `HOST`
  * Gildi sem notað er til að útbúa slóð á vefþjón
  * Sjálfgefið `127.0.0.1`
* `PORT`
  * Gildi fyrir port sem forrit keyrir á
  * Sjálfgefið `3000`
* `BASE_URL`
  * Gildi fyrir slóð á vefþjón, á forminu `https://example.org`
  * Notað fyrir lýsigögn (paging) fyrir síður
  * Sjálfgefið óskilgreint
* `JWT_TOKEN_LIFETIME`
  * Hversu lengi JWT token er gildur
  * Sjálfgefið sjö dagar eða `60 * 60 * 24 * 7` sekúndur
* `BCRYPT_ROUNDS`
  * Hversu oft á að hasha bcryptuð lykilorð
  * Sjálfgefið `11`

## Uppsetning

1. Búa til gagnagrunn, t.d. `createdb 2019-h1-synilausn`
2. Búa til Cloudinary aðgang
3. Afrita `.env_example` í `.env` og setja upplýsingar fyrir
  a. Gagnagrunn
  b. Cloudinary
4. Keyra `npm run setup` til að:
  a. Útbúa gagnagrunn og fylla af gögnum búnum til með `faker`
  b. Færa allar myndir úr `img` í Cloudinary
  c. Útbúa grunn notendur
  d. Útbúa pantanir og körfu fyrir notendur

```bash
createdb 2019-h1-synilausn
cp .env_example .env # Stilla breytur sem er krafist
npm install
npm test -s
npm run setup -s
npm run dev
```

### Notendur

* Stjórnandi með notandanafn `admin`, lykilorð `1234`

## Skipanir

### Athuganir

Til að athuga hvort test séu rétt útfærð keyra test og fyrir eslint keyra lint

```bash
npm run test
npm run lint
```


### Curl 

TODO

## Tæki og tól

### Dependencies

```
bcrypt
cloudinary
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

## Heroku

https://vef2h1-rfc.herokuapp.com

> Útgáfa 0.5

| Útgáfa | Breyting      |
| ------ | ------------- |
| 0.1    | Bæta Readme   |
| 0.2    | Base files    |
| 0.3    | Database      |
| 0.4    | Users         |
| 0.5    | Menu          |
