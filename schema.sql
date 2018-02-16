create table users (
  id serial primary key,
  username varchar(64) not null,
  date timestamp with time zone not null default current_timestamp,
  email varchar(64) not null,
  ssn varchar(11) not null,
  amount INT not null,
);