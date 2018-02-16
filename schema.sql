CREATE TABLE public.users
(
  id SERIAL NOT NULL, 
  date timestamp with time zone NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  ssn text NOT NULL,
  amount integer NOT NULL
)