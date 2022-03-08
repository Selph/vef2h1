DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS baskets CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS basket_items;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS order_status;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS categories (
  id serial primary key,
  title character varying(64) not null unique
);

insert into categories(title) values('Kjúklingur');
insert into categories(title) values('Borgarar & Vefjur');
insert into categories(title) values('Meðlæti');
insert into categories(title) values('Eftirréttir');
insert into categories(title) values('Drykkir');

CREATE TABLE IF NOT EXISTS products (
  id serial primary key,
  title character varying(64) not null unique,
  price int not null,
  description varchar(400) not null check (description <> ''),
  image character varying(800) not null,
  category serial not null,
  created TIMESTAMP with time zone not null default current_timestamp,
  updated TIMESTAMP with time zone not null default current_timestamp,
    foreign key(category) references categories(id)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS baskets (
  uid uuid primary key DEFAULT uuid_generate_v1(),
  created TIMESTAMP with time zone not null default current_timestamp
);

insert into baskets(uid) values('f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0');
insert into baskets(uid) values('31df2d79-2a43-4da0-a17e-6c65f0a78320');
insert into baskets(uid) values('6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf');

CREATE TABLE IF NOT EXISTS basket_items (
  id serial primary key,
  product_id int not null,
  uid uuid not null,
  amount int not null check (amount > 0),
    foreign key(product_id) references products(id),
    foreign key(uid) references baskets(uid)
);


CREATE TABLE IF NOT EXISTS orders (
  uid uuid primary key,
  created TIMESTAMP with time zone not null default current_timestamp,
  name character varying(64) not null
);

insert into orders(uid,name) values('f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 'Jón');
insert into orders(uid,name) values('31df2d79-2a43-4da0-a17e-6c65f0a78320', 'Ólafur');
insert into orders(uid,name) values('6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 'Bingi');

CREATE TABLE IF NOT EXISTS order_items (
  id serial primary key,
  product_id int not null,
  uid uuid not null,
  amount int not null check (amount > 0),
    foreign key(product_id) references products(id),
    foreign key(uid) references orders(uid)
);

CREATE TABLE IF NOT EXISTS order_status (
  uid uuid primary key,
  status character varying(32) not null,
  updated TIMESTAMP with time zone not null default current_timestamp,
    foreign key(uid) references orders(uid)
);

CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  name character varying(64) not null,
  username character varying(64) not null unique,
  password character varying(256) not null,
  email VARCHAR(256) NOT NULL UNIQUE,
  admin boolean default false
);

INSERT INTO users (name, username, password, email, admin) VALUES ('admin', 'admin', '$2b$11$HRLp260MPwDT8/f8LFTdAuabMsDKY8ItHtHVVv2M65dC24//QOTni', 'ultradmin@admin.com', true);
