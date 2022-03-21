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

1. Búa til gagnagrunn, t.d. `createdb vef-2022-h1`
2. Búa til Cloudinary aðgang
3. Afrita `.env_example` í `.env` og setja upplýsingar fyrir
  a. Gagnagrunn
  b. Cloudinary
4. Keyra `npm run setup` til að:
  a. Útbúa gagnagrunn og fylla af gögnum
  b. Færa allar myndir úr `img` í Cloudinary

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

### cURL

#### Matseðill, vefþjónustur

* `/menu`
  * `GET` 
  ```bash 
  curl --location --request GET 'http://localhost:3000/menu'
  ```
  * `POST` 
  ```bash
  curl --location --request POST 'http://localhost:3000/menu/19/vefja.jpg' \
  --header 'Authorization: Bearer >tokenhér<' \
  --form 'title="VEGANOVICH Vefja"' \
  --form 'price="1249"' \
  --form 'description="RFC VEGAN kjúklingalundir, iceberg salat, salsa og létt piparmajónes. Allt vafið saman í heita, mjúkaristaða tortillu"' \
  --form 'image=@"/path/to/file"' \
  --form 'category="2"'
  ```
* `/menu?category={category}`
  * `GET` 
  ```bash
  curl --location --request GET 'http://localhost:3000/menu?category=1'
  ```
* `/menu?search={query}`
  * `GET` 
  ```bash
  curl --location --request GET 'http://localhost:3000/menu?search=vegan'
  ```
* `/menu/:id`
  * `GET` 
  ```bash
  curl --location --request GET 'http://localhost:3000/menu/10'
  ```
  * `PATCH` 
  ```bash curl --location --request PATCH 'http://localhost:3000/menu/5' \
  --header 'Authorization: Bearer >tokenhér<' \
  --form 'title="Megavefjan"' \
  --form 'price="1777"' \
  --form 'description="Þessi er góð"' \
  --form 'image=@"/Users/hugsnilld/Library/Mobile Documents/com~apple~CloudDocs/Skóli/Háskóli Íslands/Tölvunarfræði/2. Ár/Vefforritun 2/Hopverkefni 1/src/img/vefja.jpg"'
  ```
  * `DELETE` 
  ```bash
  curl --location --request DELETE 'http://localhost:3000/menu/4' \
  --header 'Authorization: Bearer >tokenhér<'
  ```
* `/categories`
  * `GET` 
  ```bash
  curl --location --request GET 'http://localhost:3000/categories'
  ```
  * `POST` 
  ```bash
  curl --location --request POST 'http://localhost:3000/categories' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "title": "Mjólkurvörur"
  }'
  ```
* `/categories/:id`
  * `PATCH` 
  ```bash
  curl --location --request PATCH 'http://localhost:3000/categories/?id=1' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "title": "hkgg"
  }'
  ```
  * `DELETE` 
  ```bash
  curl --location --request DELETE 'http://localhost:3000/categories/2' \
  --data-raw ''
  ```

#### Karfa, vefþjónustur

* `/cart/:cartid`
  * `GET` 
  ```bash
  curl --location --request GET 'http://localhost:3000/cart/f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0'
  ```

#### Pöntun, vefþjónustur

* `/orders`
  * `GET` 
  ```bash
  curl --location --request GET 'http://localhost:3000/orders' \
  --header 'Authorization: Bearer >token hér<'
  ```

#### Notendur, vefþjónustur

* `/users/`
  * `GET` 
  ```bash
  curl --location --request GET 'http://localhost:3000/users' \
  --header 'Authorization: Bearer >tokenhér<'
  ```
* `/users/:id`
  * `GET` 
  ```bash
  curl --location --request GET 'http://localhost:3000/users/2' \
  --header 'Authorization: Bearer >tokenhér<'
  ```
  * `PATCH` 
  ```bash
  curl --location --request PATCH 'http://localhost:3000/users/2' \
  --header 'Authorization: Bearer >tokenhér<'
  ```
* `/users/register`
  * `POST` 
  ```bash
  curl --location --request POST 'http://localhost:3000/users/register' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "name": "Jonathan Joestar",
      "username": "goldenwind",
      "password": "dio",
      "email": "goldenwindd@jojo.com"
  }'
  ```
* `/users/login`
  * `POST` 
  ```bash
  curl --location --request POST 'http://localhost:3000/users/login' \
  --header 'Authorization: Bearer >tokenhér<' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "username": "admin",
      "password": "1234"
  }'
  ```
* `/users/me`
  * `GET` 
  ```bash
  curl --location --request GET 'http://localhost:3000/users/me' \
  --header 'Authorization: Bearer >tokenhér<'
  ```
  * `PATCH` 
  ```bash
  curl --location --request PATCH 'http://localhost:3000/users/me' \
  --header 'Authorization: Bearer >tokenhér<' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "password": "slavo",
      "email": "bomkiss@admin.com"
  }'
  ```

ATH það gæti þurft að nota tvöfaldar gæsalappir í Windows fyrir cURL strengi.

### Athuganir

Til að athuga hvort test séu rétt útfærð keyra test og fyrir eslint keyra lint

```bash
npm run test
npm run lint
```

Athuganir sem eru keyrðar eru:

```
Get test á Cart
Ýmis get test á menu
Ýmis get test á orders, m.a. til að testa offset og paging
Post test á Users til að m.a. prófa auðkenningu
```


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

> Þáttakendur verkefnis

| Git usr   | Nafn                     | HI usr |
| --------- | ------------------------ | ------ |
| Selph     | Árni Þór Sörensen        | ats30  |
| RbrtNkvi  | Róbert Nökkvi Gunnarsson | rng1   |
| tommijons | Tómas Jónsson            | toj6   |


> Útgáfa 1.0

| Útgáfa | Breyting      |
| ------ | ------------- |
| 0.1    | Bæta Readme   |
| 0.2    | Base files    |
| 0.3    | Database      |
| 0.4    | Users         |
| 0.5    | Menu          |
| 0.6    | Cart          |
| 0.7    | Orders        |
| 0.8    | Tests         |
| 0.9    | Lint          |
| 1.0    | Readme        |
