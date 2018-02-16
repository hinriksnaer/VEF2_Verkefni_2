CREATE TABLE public.users
(
  id integer NOT NULL DEFAULT nextval('"users_Id_seq"'::regclass),
  date timestamp with time zone NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  ssn text NOT NULL,
  amount integer NOT NULL
)