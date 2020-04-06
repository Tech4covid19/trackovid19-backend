CREATE TABLE public.share_images_by_postalcode
(
    postalcode1 character varying(4) COLLATE pg_catalog."default" NOT NULL,
    image_hash character varying(256) COLLATE pg_catalog."default",
    image_url character varying(265) COLLATE pg_catalog."default",
    CONSTRAINT share_images_by_postalcode_pk PRIMARY KEY (postalcode1)
);

ALTER TABLE public.share_images_by_postalcode
    OWNER to postgres;

GRANT ALL ON TABLE public.share_images_by_postalcode TO postgres;