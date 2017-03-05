drop table if exists list;
create table list (
	id serial primary key
	,active boolean default true
	,public boolean default true
	,uses_other_lists boolean default false
	,user_id int default 0
	,key varchar(10) not null default ''
	,title varchar(200) not null default ''
	,slug varchar(200) not null default ''
	,description text default ''
	,created timestamp default '0001-01-01 00:00:00'
	,modified timestamp default '0001-01-01 00:00:00'
);

drop table if exists asset;
create table asset (
	id serial primary key
	,active boolean default true
	,title varchar(200) not null default ''
	,alias varchar(200) not null default ''
	,description text default ''
	,created timestamp default '0001-01-01 00:00:00'
	,modified timestamp default '0001-01-01 00:00:00'
);

drop table if exists list_asset_map;
create table list_asset_map (
	id serial primary key
	,active boolean default true
	,list_id int not null default 0
	,asset_id int not null default 0
	,created timestamp default '0001-01-01 00:00:00'
	,modified timestamp default '0001-01-01 00:00:00'
);

drop table if exists list_combination_map;
create table list_combination_map (
	id serial primary key
	,active boolean default true
	,static boolean default true
	,list_id int not null default 0
	,secondary_list_id int not null default 0
	,created timestamp default '0001-01-01 00:00:00'
	,modified timestamp default '0001-01-01 00:00:00'
);