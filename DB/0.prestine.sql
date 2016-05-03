create table users (
	pk serial primary key,
	mobile_number text not null,
	name text not null,
	location text not null,
	password text not null,
	archived boolean default false
);

create table categories (
	pk serial primary key,
	category text not null,
	archived boolean default false
);

create table items (
	pk serial primary key,
	categories_pk int references categories(pk),
	item text not null,
	price numeric not null,
	description text not null,
	delivery_time time not null,
	image text not null,
	archived boolean default false
);

create table statuses (
	pk serial primary key,
	status text not null,
	archived boolean default false
);

create table mode_of_payment (
	pk serial primary key,
	mode text not null,
	archived boolean default false
);

create table orders (
	pk serial primary key,
	order_number text not null,
	users_pk int references users(pk),
	status_pk int references statuses(pk),
	mode_of_payment_pk int references mode_of_payment(pk),
	date_created timestamptz default now(),
	archived boolean default false
);

create table orders_items(
	orders_pk int references orders(pk),
	items_pk int references items(pk),
	number_of_items int,
	price numeric not null,
	delivery_time time
);

create table payment_details(
	orders_pk int references orders(pk),
	mode_of_payment_pk int references mode_of_payment(pk),
	date_created timestamptz default now()
);

create table items_reviews(
	items_pk int not null,
	review text not null,
	created_by int references users(pk),
	stars int not null
);

alter table users owner to gosari;
alter table categories owner to gosari;
alter table items owner to gosari;
alter table statuses owner to gosari;
alter table mode_of_payment owner to gosari;
alter table orders owner to gosari;
alter table orders_items owner to gosari;
alter table payment_details owner to gosari;
alter table items_reviews owner to gosari;

create unique index users_mobile_number_idx on users (mobile_number);
create unique index categories_category_idx on categories (category);
create unique index items_item_idx on items (categories_pk, item);