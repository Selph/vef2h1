CREATE TABLE IF NOT EXISTS categories (
  id serial primary key,
  title character varying(64) not null unique
);

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
)

CREATE TABLE IF NOT EXISTS

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username character varying(64) not null unique,
  password character varying(256) not null,
);

INSERT INTO users (username, password) VALUES ('admin', '$2b$11$HRLp260MPwDT8/f8LFTdAuabMsDKY8ItHtHVVv2M65dC24//QOTni');
