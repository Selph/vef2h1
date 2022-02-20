CREATE TABLE IF NOT EXISTS categories (
  id serial primary key,
  title character varying(64) not null unique
);

insert into categories(title) values('Kjúklingur');
insert into categories(title) values('Borgarar & Vefjur');
insert into categories(title) values('Salöt');
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

insert into products(title, price, description, image, category) values('Kjúklingur', 499, 'Þetta byrjaði allt með kjúklingabitunum og leyniuppskriftinni sem Ragnar bóndi setti saman úr 11 mismunandi kryddum og jurtum árið 1930 í hjarta Reykjavíkur, sjálfur Breiðholtinu. Þetta óviðjafnanlega bragð stendur alltaf fyrir sínu í kjúklingabitunum sem eru steiktir til gullinnar fullkomnunar.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/chicken.jpg', 1);
insert into products(title, price, description, image, category) values('Vængir', 749, 'Ferskir kjúklingavængir, marineraðir í RFC marineringu og léttsteiktir til að fá stökka húð. Ómótstæðilegir.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/wings.jpg', 1);
insert into products(title, price, description, image, category) values('Kjúklingalundir', 499, 'Ljúffengar kjúklingalundir, marineraðar og tvíkryddaðar með ljúffengu kryddblöndunni okkar.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/fillet.jpg', 1);

insert into products(title, price, description, image, category) values('Kjúklingaborgari', 1259, 'Hinn eini sanni RFC Original kjúklingaborgari. Mjúk kjúklingabringa, iceberg salat, léttmajónes og ristað hamborgarabrauð.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/burger.jpg', 2);
insert into products(title, price, description, image, category) values('Reykjavíkurvefja', 1249, 'RFC kjúklingalundir, iceberg salat, salsa og létt piparmajónes. Allt vafið saman í heita, mjúka, ristaða tortillu.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/vefja.jpg', 2);
insert into products(title, price, description, image, category) values('NOT CHICKEN borgari', 1249, 'NOT CHICKEN kjúklingaborgarinn hentar fólki sem vill ekki kjúklingaborgarann! Mjúkur NOT CHICKEN, kál, léttmæjó og ristað hamborgarabrauð.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/notchicken.jpeg', 2);

insert into products(title, price, description, image, category) values('Franskar kartöflur', 479, 'Ljúffengu frönsku kartöflurnar okkar!', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/french-fries.jpg', 4);
insert into products(title, price, description, image, category) values('Maísstöngull', 329, 'Til að ná fram þessu góða bragði er sæti, guli maísinn okkar tíndur á besta tíma uppskerunnar. Íslenskt smjör fylgir.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/corn.png', 4);
insert into products(title, price, description, image, category) values('Hrásalat', 329, 'Við blöndum fersku káli og gulrótum saman við ljúffenga dressingu til að fá ferskt, tilbúið meðlæti sem bragðast vel með öllum máltíðum.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/coleslaw.png', 4);

insert into products(title, price, description, image, category) values('Milkshake - Súkkilaði', 599, 'Milkshake með súkkulaðibragði. Hristu upp í sumrinu með glænýjum Milkshake með súkkulaðibragði. Súkkulaðisósa frá DaVinci tryggir alvöru súkkulaðihristing. Eins klassískur og hann gerist.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/milkshake-chocolate.jpg', 5);
insert into products(title, price, description, image, category) values('Milkshake - Vanilla', 599, 'Milkshake með súkkulaðibragði. Hristu upp í sumrinu með glænýjum Milkshake með vanillubragði. Vanillusósa frá DaVinci tryggir alvöru vanilluhristing. Eins klassískur og hann gerist.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/milkshake-vanilla.jpeg', 5);
insert into products(title, price, description, image, category) values('Milkshake - Jarðaber', 599, 'Milkshake með súkkulaðibragði. Hristu upp í sumrinu með glænýjum Milkshake með jarðaberjabragði. Jarðaberjasósa frá DaVinci tryggir alvöru jarðaberjahristing. Eins klassískur og hann gerist.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/milkshake-strawberry.jpeg', 5);

insert into products(title, price, description, image, category) values('Gos úr vél', 369, 'Í öllum gosvélunum okkar bjóðum við upp á ískalt og svalandi Pepsi, Pepsi Max, Egils Appelsín án sykurs, 7-Up free, rauðan Plús og kolsýrt vatn.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/soda.jpg', 6);
insert into products(title, price, description, image, category) values('Malt', 429, 'Þetta klassíska, ískalda Egils Malt í dós.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/malt.jpg', 6);
insert into products(title, price, description, image, category) values('Floridana', 169, 'Floridana eru bragðgóðir svalandi ávaxtasafar. Epla-, appelsínu- eða Heilsusafi.', 'https://notendur.hi.is/ats30/Tolvunarfraedi/Vefforritun%202/Hópverkefni%202/img/floridana.jpg', 6);

CREATE TABLE IF NOT EXISTS baskets (
  uid uuid primary key,
  created TIMESTAMP with time zone not null default current_timestamp
);

insert into baskets(uid) values('f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0');
insert into baskets(uid) values('31df2d79-2a43-4da0-a17e-6c65f0a78320');
insert into baskets(uid) values('6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf');

CREATE TABLE IF NOT EXISTS basket_items (
  id serial,
  uid uuid not null,
  amount int not null check (amount > 0),
    foreign key(id) references products(id),
    foreign key(uid) references baskets(uid)
);

insert into basket_items(id, uid, amount) values(1, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);
insert into basket_items(id, uid, amount) values(2, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);
insert into basket_items(id, uid, amount) values(11, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);

insert into basket_items(id, uid, amount) values(2, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(id, uid, amount) values(1, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(id, uid, amount) values(7, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 2);
insert into basket_items(id, uid, amount) values(8, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(id, uid, amount) values(9, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(id, uid, amount) values(10, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(id, uid, amount) values(12, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 2);

insert into basket_items(id, uid, amount) values(5, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 1);
insert into basket_items(id, uid, amount) values(6, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 1);
insert into basket_items(id, uid, amount) values(7, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 2);
insert into basket_items(id, uid, amount) values(12, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 2);


CREATE TABLE IF NOT EXISTS orders (
  uid uuid primary key,
  created TIMESTAMP with time zone not null default current_timestamp,
  name character varying(64) not null,
    foreign key(uid) references baskets(uid)
);

insert into orders(uid,name) values('f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 'Jón');
insert into orders(uid,name) values('31df2d79-2a43-4da0-a17e-6c65f0a78320', 'Ólafur');
insert into orders(uid,name) values('6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 'Bingi');

CREATE TABLE IF NOT EXISTS order_items (
  id serial,
  uid uuid not null,
  amount int not null check (amount > 0),
    foreign key(id) references products(id),
    foreign key(uid) references baskets(uid)
);

insert into order_items(id, uid, amount) values(1, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);
insert into order_items(id, uid, amount) values(2, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);
insert into order_items(id, uid, amount) values(11, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);

insert into order_items(id, uid, amount) values(2, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(id, uid, amount) values(1, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(id, uid, amount) values(7, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 2);
insert into order_items(id, uid, amount) values(8, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(id, uid, amount) values(9, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(id, uid, amount) values(10, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(id, uid, amount) values(12, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 2);

insert into order_items(id, uid, amount) values(5, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 1);
insert into order_items(id, uid, amount) values(6, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 1);
insert into order_items(id, uid, amount) values(7, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 2);
insert into order_items(id, uid, amount) values(12, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 2);

CREATE TABLE IF NOT EXISTS order_status (
  uid uuid primary key,
  status character varying(32) not null,
  updated TIMESTAMP with time zone not null default current_timestamp,
    foreign key(uid) references orders(uid)
);

insert into order_status(uid, status) values('f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 'NEW');
insert into order_status(uid, status) values('31df2d79-2a43-4da0-a17e-6c65f0a78320', 'COOKING');
insert into order_status(uid, status) values('6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 'FINISHED');

CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username character varying(64) not null unique,
  password character varying(256) not null
);

INSERT INTO users (username, password) VALUES ('admin', '$2b$11$HRLp260MPwDT8/f8LFTdAuabMsDKY8ItHtHVVv2M65dC24//QOTni');
