create table Users (
  id serial primary key,
  username varchar(64) not null,
  date timestamp with time zone not null,
  email varchar(64) not null,
  ssn varchar(11) not null,
  amount integer not null,
);