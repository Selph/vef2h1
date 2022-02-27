-- Basket

insert into basket_items(product_id, uid, amount) values(1, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);
insert into basket_items(product_id, uid, amount) values(2, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);
insert into basket_items(product_id, uid, amount) values(11, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);

insert into basket_items(product_id, uid, amount) values(2, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(product_id, uid, amount) values(1, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(product_id, uid, amount) values(7, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 2);
insert into basket_items(product_id, uid, amount) values(8, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(product_id, uid, amount) values(9, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(product_id, uid, amount) values(10, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into basket_items(product_id, uid, amount) values(12, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 2);

insert into basket_items(product_id, uid, amount) values(5, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 1);
insert into basket_items(product_id, uid, amount) values(6, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 1);
insert into basket_items(product_id, uid, amount) values(7, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 2);
insert into basket_items(product_id, uid, amount) values(12, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 2);


-- Orders

insert into order_items(product_id, uid, amount) values(1, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);
insert into order_items(product_id, uid, amount) values(2, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);
insert into order_items(product_id, uid, amount) values(11, 'f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 2);

insert into order_items(product_id, uid, amount) values(2, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(product_id, uid, amount) values(1, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(product_id, uid, amount) values(7, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 2);
insert into order_items(product_id, uid, amount) values(8, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(product_id, uid, amount) values(9, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(product_id, uid, amount) values(10, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 1);
insert into order_items(product_id, uid, amount) values(12, '31df2d79-2a43-4da0-a17e-6c65f0a78320', 2);

insert into order_items(product_id, uid, amount) values(5, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 1);
insert into order_items(product_id, uid, amount) values(6, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 1);
insert into order_items(product_id, uid, amount) values(7, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 2);
insert into order_items(product_id, uid, amount) values(12, '6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 2);


-- Order status

insert into order_status(uid, status) values('f19d71d1-a3ea-49ba-a3ee-1fc81ea7c5c0', 'NEW');
insert into order_status(uid, status) values('31df2d79-2a43-4da0-a17e-6c65f0a78320', 'COOKING');
insert into order_status(uid, status) values('6810fb1d-14d5-4cd3-a30c-6ed2fb0e44bf', 'FINISHED');
