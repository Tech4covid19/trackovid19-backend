-- push subscriptions ------------------------------------

CREATE SEQUENCE public.push_subscriptions_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.push_subscriptions_id_seq
    OWNER TO postgres;
	

CREATE TABLE public.push_subscriptions
(
    id integer NOT NULL DEFAULT nextval('public.push_subscriptions_id_seq'::regclass),
    user_id integer NOT NULL,
	push_type character varying(50) NOT NULL,
    endpoint character varying(500) NOT NULL,
    keys character varying(500) NOT NULL,
    send_error_count integer NOT NULL,
    CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id)
);

ALTER TABLE public.push_subscriptions
    OWNER to postgres;
	
CREATE UNIQUE INDEX push_subscriptions_id0 ON public.video_shares USING btree (id);
	
CREATE INDEX push_subscriptions_user_id ON public.push_subscriptions USING btree (user_id);

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_user_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


