-- videos ------------------------------------

CREATE SEQUENCE public.videos_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.videos_id_seq
    OWNER TO postgres;
	

CREATE TABLE public.videos
(
    id integer NOT NULL DEFAULT nextval('videos_id_seq'::regclass),
    title character varying(100) NOT NULL,
    description character varying(500) NOT NULL,
    video character varying(500) NOT NULL,
    video_order integer NOT NULL,
    available boolean NOT NULL,
    CONSTRAINT videos_pkey PRIMARY KEY (id)
);

ALTER TABLE public.videos
    OWNER to postgres;
	
CREATE UNIQUE INDEX videos_id0
    ON public.videos USING btree
    (id ASC NULLS LAST);


-- video shares ------------------------------------

CREATE SEQUENCE public.video_shares_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.video_shares_id_seq
    OWNER TO postgres;
	

CREATE TABLE public.video_shares
(
    id integer NOT NULL DEFAULT nextval('video_shares_id_seq'::regclass),
    video_id integer NOT NULL,
    target character varying(50) NOT NULL,
    share_link character varying(500) NOT NULL,
    share_order integer NOT NULL,
    available boolean NOT NULL,
    CONSTRAINT video_shares_pkey PRIMARY KEY (id)
);

ALTER TABLE public.video_shares
    OWNER to postgres;
	
CREATE UNIQUE INDEX video_shares_id0 ON public.video_shares USING btree (id);
	
CREATE INDEX video_shares_video ON public.video_shares USING btree (video_id);

ALTER TABLE ONLY public.video_shares
    ADD CONSTRAINT video_shares_video_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id);


-- dummy data

INSERT INTO public.videos(
	title, description, video, video_order, available)
	VALUES ('video 1', 'video 1 desc', 'youtube/ajhsdg', 1, true);

INSERT INTO public.video_shares(
	video_id, target, share_link, share_order, available)
	VALUES (1, 'facebook', 'facebook-link', 1, true);

INSERT INTO public.video_shares(
	video_id, target, share_link, share_order, available)
	VALUES (1, 'twitter', 'twitter-link', 2, true);


INSERT INTO public.videos(
	title, description, video, video_order, available)
	VALUES ('video 2', 'video 2 desc', 'youtube/wdf3f34f34g34g34g34tg', 2, true);

INSERT INTO public.video_shares(
	video_id, target, share_link, share_order, available)
	VALUES (2, 'facebook', 'facebook-link2', 1, true);