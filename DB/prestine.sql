create table users (
	mobile_number int primary key not null,
	name text not null,
	address text not null,
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
	archived boolean default false
);

create table orders (
	pk serial primary key,
	order_number int not null,
	date_created timestamptz default now(),
	archived boolean default false
);

create table orders_items(
	orders_pk int references orders(pk),
	items_pk int references items(pk),
	delivery_time timestamptz
);

alter table users owner to gosari;
alter table categories owner to gosari;
alter table items owner to gosari;
alter table orders owner to gosari;
alter table orders_items owner to gosari;