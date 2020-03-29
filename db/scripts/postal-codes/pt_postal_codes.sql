-- DATA IS AVAILABLE IN pt_postal_codes_data.sql.zip
-- ORIGINAL DATA FROM CTT IS AVAILABLE IN ctt.zip

CREATE SEQUENCE public.pt_postal_codes_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.pt_postal_codes_id_seq
    OWNER TO postgres;

create table public.pt_postal_codes
(
	id integer NOT NULL DEFAULT nextval('public.pt_postal_codes_id_seq'::regclass),
    postal_number character(4),
	postal_extension character(3),
	name character varying(200),
	municipality_name character varying(100),
	district_name character varying(100),
    CONSTRAINT pt_postal_codes_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX pt_postal_codes_number_extension ON public.pt_postal_codes USING btree (postal_number, postal_extension);
