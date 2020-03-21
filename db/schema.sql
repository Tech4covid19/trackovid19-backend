--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 12.2

-- Started on 2020-03-17 02:29:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 606 (class 1247 OID 24594)
-- Name: statustype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.statustype AS ENUM (
    'infected',
    'recovered',
    'normal',
    'quarentine',
    'self quarentine'
);


ALTER TYPE public.statustype OWNER TO postgres;

SET default_tablespace = '';

--
-- TOC entry 203 (class 1259 OID 24778)
-- Name: confinement_states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.confinement_states (
    id integer NOT NULL,
    state character varying(100),
    state_summary character varying(100),
    description character varying(500),
    summary_order integer not null,
    show_in_summary boolean not null
);


ALTER TABLE public.confinement_states OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 24776)
-- Name: confinement_states_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.confinement_states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.confinement_states_id_seq OWNER TO postgres;

--
-- TOC entry 3926 (class 0 OID 0)
-- Dependencies: 202
-- Name: confinement_states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.confinement_states_id_seq OWNED BY public.confinement_states.id;


--
-- TOC entry 213 (class 1259 OID 24869)
-- Name: example; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.example (
    user_id character varying(16),
    inteiro integer,
    numerico numeric,
    bytes bytea NOT NULL,
    texto character varying(16),
    list_of_3_ints integer[],
    list_of_ints integer[],
    authorized boolean DEFAULT false,
    "timestamp" timestamp without time zone DEFAULT timezone('utc'::text, now()),
    unix_timestamp integer DEFAULT date_part('epoch'::text, now())
);


ALTER TABLE public.example OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 24800)
-- Name: history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.history (
    id bigint NOT NULL,
    user_id character varying(16),
    status integer,
    confinement_state integer,
    postalcode1 character varying(4),
    postalcode2 character varying(3),
    latitude numeric,
    longitude numeric,
    info character varying(500),
    "timestamp" timestamp without time zone DEFAULT timezone('utc'::text, now()),
    unix_ts bigint DEFAULT date_part('epoch'::text, now())
);


ALTER TABLE public.history OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 24798)
-- Name: history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.history_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.history_id_seq OWNER TO postgres;

--
-- TOC entry 3927 (class 0 OID 0)
-- Dependencies: 205
-- Name: history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.history_id_seq OWNED BY public.history.id;


--
-- TOC entry 211 (class 1259 OID 24860)
-- Name: latest_status; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.latest_status AS
 SELECT a.user_id,
    a.id as history_id,
    a.status,
    a.confinement_state,
    a."timestamp"
   FROM public.history a
  WHERE (NOT (EXISTS ( SELECT 1
           FROM public.history b
          WHERE (((a.user_id)::text = (b.user_id)::text) AND (a.id < b.id)))));


ALTER TABLE public.latest_status OWNER TO postgres;


--
-- TOC entry 210 (class 1259 OID 24848)
-- Name: network; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.network (
    id integer NOT NULL,
    user_id character varying(16),
    met_with character varying(16),
    facebook_id bytea,
    latitude numeric,
    longitude numeric,
    info character varying(500),
    "timestamp" timestamp without time zone DEFAULT timezone('utc'::text, now()),
    unix_ts bigint DEFAULT date_part('epoch'::text, now())
);


ALTER TABLE public.network OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 24846)
-- Name: network_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.network_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.network_id_seq OWNER TO postgres;

--
-- TOC entry 3928 (class 0 OID 0)
-- Dependencies: 209
-- Name: network_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.network_id_seq OWNED BY public.network.id;


--
-- TOC entry 204 (class 1259 OID 24786)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(16) NOT NULL,
    hash bytea,
    facebook_id bytea,
    patient_token character varying(256),
    show_onboarding boolean DEFAULT true,
    year integer,
    postalcode1 character varying(4),
    postalcode2 character varying(3),
    ip character varying(20),
    latitude numeric,
    longitude numeric,
    info character varying(500),
    "timestamp" timestamp without time zone DEFAULT timezone('utc'::text, now()),
    unix_ts bigint DEFAULT date_part('epoch'::text, now())
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 24864)
-- Name: network_status; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.network_status AS
 SELECT b.user_id,
    b.met_with,
    c.status,
    c.confinement_state,
    c."timestamp"
   FROM ((public.users a
     JOIN public.network b ON (((a.id)::text = (b.user_id)::text)))
     JOIN public.latest_status c ON (((b.met_with)::text = (c.user_id)::text)));


ALTER TABLE public.network_status OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 24771)
-- Name: symptoms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.symptoms (
    id integer NOT NULL,
    symptom character varying(100)
);


ALTER TABLE public.symptoms OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 24769)
-- Name: symptoms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.symptoms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.symptoms_id_seq OWNER TO postgres;

--
-- TOC entry 3929 (class 0 OID 0)
-- Dependencies: 200
-- Name: symptoms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.symptoms_id_seq OWNED BY public.symptoms.id;


--
-- TOC entry 199 (class 1259 OID 24764)
-- Name: user_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_status (
    id integer NOT NULL,
    status character varying(100) not null,
    status_summary character varying(100) not null,
    summary_order integer not null,
    show_in_summary boolean not null
);


ALTER TABLE public.user_status OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 24762)
-- Name: user_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_status_id_seq OWNER TO postgres;

--
-- TOC entry 3930 (class 0 OID 0)
-- Dependencies: 198
-- Name: user_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_status_id_seq OWNED BY public.user_status.id;


--
-- TOC entry 208 (class 1259 OID 24829)
-- Name: user_symptoms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_symptoms (
    id bigint NOT NULL,
    history_id bigint,
    symptom_id integer,
    "timestamp" timestamp without time zone DEFAULT timezone('utc'::text, now()),
    unix_ts bigint DEFAULT date_part('epoch'::text, now())
);


ALTER TABLE public.user_symptoms OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 24827)
-- Name: user_symptoms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_symptoms_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_symptoms_id_seq OWNER TO postgres;

--
-- TOC entry 3931 (class 0 OID 0)
-- Dependencies: 207
-- Name: user_symptoms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_symptoms_id_seq OWNED BY public.user_symptoms.id;


--
-- TOC entry 3738 (class 2604 OID 24781)
-- Name: confinement_states id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.confinement_states ALTER COLUMN id SET DEFAULT nextval('public.confinement_states_id_seq'::regclass);


--
-- TOC entry 3741 (class 2604 OID 24803)
-- Name: history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history ALTER COLUMN id SET DEFAULT nextval('public.history_id_seq'::regclass);


--
-- TOC entry 3747 (class 2604 OID 24851)
-- Name: network id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network ALTER COLUMN id SET DEFAULT nextval('public.network_id_seq'::regclass);


--
-- TOC entry 3737 (class 2604 OID 24774)
-- Name: symptoms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.symptoms ALTER COLUMN id SET DEFAULT nextval('public.symptoms_id_seq'::regclass);


--
-- TOC entry 3736 (class 2604 OID 24767)
-- Name: user_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_status ALTER COLUMN id SET DEFAULT nextval('public.user_status_id_seq'::regclass);


--
-- TOC entry 3744 (class 2604 OID 24832)
-- Name: user_symptoms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_symptoms ALTER COLUMN id SET DEFAULT nextval('public.user_symptoms_id_seq'::regclass);


--
-- Name: status_by_postalcode; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.status_by_postalcode
as
select us.postalcode1, us.id as status, us.status_summary as status_text, us.summary_order, count(h.*) as hits
from public.history h
inner join public.latest_status ls on ls.user_id = h.user_id and ls.history_id = h.id
right outer join (
	select * 
	from (
		select distinct h.postalcode1
		from public.history h
	) hh
	cross join (
		select *
		from public.user_status users
		where users.show_in_summary = true
	) us
) us on us.id = h.status and us.postalcode1 = h.postalcode1
group by us.postalcode1, us.id, us.status_summary, us.summary_order
union all
select h.postalcode1, case when us.has_symptoms then 100 else 200 end as status, case when us.has_symptoms then 'Com sintomas' else 'Sem sintomas' end as status_text, case when us.has_symptoms then 5 else 6 end as summary_order, count(h.*) as hits
from public.history h
inner join public.latest_status ls on ls.user_id = h.user_id and ls.history_id = h.id
inner join (
	select uus.history_id, min(uus.symptom_id), case when min(uus.symptom_id) = 1 then false else true end as has_symptoms
	from public.user_symptoms uus
	group by uus.history_id
) us on us.history_id = h.id
where h.postalcode1 is not null
group by h.postalcode1, us.has_symptoms;

ALTER TABLE public.status_by_postalcode OWNER TO postgres;

--
-- Name: confinement_states_by_postalcode; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.confinement_states_by_postalcode
as
select con.postalcode1, con.confinement_state, con.state_summary as confinement_state_text, con.summary_order, sum(con.hit_value) as hits
from (
	select cs.postalcode1, case when cs.id in (2, 3) then 300 else cs.id end as confinement_state, cs.state_summary, cs.summary_order, case when h.confinement_state is not null then 1 else 0 end as hit_value
	from public.history h
	inner join public.latest_status ls on ls.user_id = h.user_id and ls.history_id = h.id
	right outer join (
		select * 
		from (
			select distinct h.postalcode1
			from public.history h
		) hh
		cross join (
			select *
			from public.confinement_states cons
			where cons.show_in_summary =  true
		) cs
	) cs on cs.id = h.confinement_state and cs.postalcode1 = h.postalcode1
) as con
group by con.postalcode1, con.confinement_state, con.state_summary, con.summary_order;

ALTER TABLE public.confinement_states_by_postalcode OWNER TO postgres;

--
-- TOC entry 3911 (class 0 OID 24778)
-- Dependencies: 203
-- Data for Name: confinement_states; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.confinement_states (id, state, description, state_summary, summary_order, show_in_summary) FROM stdin;
1	Afastamento social	Presumo estar saudável e estou por opção em casa em prevenção	Em casa, preventivamente	10	true
2	Isolamento obrigatório	Estou doente e isolado através do afastamento social não contagiando outros cidadãos	Isolados	30	true
3	Quarentena	Sou um caso suspeito e estou isolado através do afastamento social não contagiando outros cidadãos	Isolados	30	true
4	Vida normal	Faço a minha rotina habitual	Rotina habitual	20	true
\.


--
-- TOC entry 3919 (class 0 OID 24869)
-- Dependencies: 213
-- Data for Name: example; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.example (user_id, inteiro, numerico, bytes, texto, list_of_3_ints, list_of_ints, authorized, "timestamp", unix_timestamp) FROM stdin;
\.


--
-- TOC entry 3914 (class 0 OID 24800)
-- Dependencies: 206
-- Data for Name: history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.history (id, user_id, status, confinement_state, latitude, longitude, info, "timestamp", unix_ts, postalcode1, postalcode2) FROM stdin;
1	1	1	1	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663	4200	192
2	1	3	2	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663	4200	192
3	1	4	3	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663	4200	192
4	2	1	3	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663	4200	192
5	2	3	1	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663	4200	192
6	3	1	2	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663	4200	192
7	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411481752	4200	192
8	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411541511	4200	192
9	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411542251	4200	192
10	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411542701	4200	192
11	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411542856	4200	192
12	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411543001	4200	192
13	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411543147	4200	192
14	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411543287	4200	192
15	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411543427	4200	192
16	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411543576	4200	192
17	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411543724	4200	192
18	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411543874	4200	192
19	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411544025	4200	192
20	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411544171	4200	192
21	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411544321	4200	192
22	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411544479	4200	192
23	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411544640	4200	192
24	2921672234562720	1	\N	31.5812858	54.0828852	\N	2012-04-23 18:25:43.511	1584411544791	4200	192
\.


--
-- TOC entry 3918 (class 0 OID 24848)
-- Dependencies: 210
-- Data for Name: network; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.network (id, user_id, met_with, facebook_id, latitude, longitude, info, "timestamp", unix_ts) FROM stdin;
1	1	2	\N	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663
2	1	3	\N	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663
3	2	1	\N	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663
4	2	3	\N	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663
5	3	1	\N	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663
6	3	2	\N	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663
\.


--
-- TOC entry 3909 (class 0 OID 24771)
-- Dependencies: 201
-- Data for Name: symptoms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.symptoms (id, symptom) FROM stdin;
1	Sem sintomas
2	Tosse
3	Congestão nasal
4	Dor de garganta
5	Dificuldade em respirar
6	Dor no peito
7	Conjuntivite
8	Febre (acima de 37.5º)
9	Cansaço
10	Dores musculares
11	Dores de cabeça
12	Naúseas / vómitos
13	Diarreia
14	Dor abdominal
\.


--
-- TOC entry 3907 (class 0 OID 24764)
-- Dependencies: 199
-- Data for Name: user_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_status (id, status, status_summary, summary_order, show_in_summary) FROM stdin;
1	Infeção confirmada	Infetados	30	true
2	Caso suspeito	Suspeitos	10	true
3	Recuperado	Recuperados	20	true
4	Presumidamente saudável	Não sabem	40	false
\.


--
-- TOC entry 3916 (class 0 OID 24829)
-- Dependencies: 208
-- Data for Name: user_symptoms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_symptoms (id, history_id, symptom_id, "timestamp", unix_ts) FROM stdin;
\.


--
-- TOC entry 3912 (class 0 OID 24786)
-- Dependencies: 204
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, hash, facebook_id, year, postalcode1, postalcode2, ip, latitude, longitude, info, "timestamp", unix_ts) FROM stdin;
1	\\x31	\N	1	1000	100	\N	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663
2	\\x32	\N	1	1000	100	\N	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663
3	\\x33	\N	1	1000	100	\N	\N	\N	\N	2020-03-16 23:01:02.622937	1584399663
2921672234562720	\N	\\x32393231363732323334353632373230	\N	\N	\N	\N	\N	\N	{"name":"João Duarte"}	2020-03-17 00:56:49.036	1584407067304
\.


--
-- TOC entry 3932 (class 0 OID 0)
-- Dependencies: 202
-- Name: confinement_states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.confinement_states_id_seq', 4, true);


--
-- TOC entry 3933 (class 0 OID 0)
-- Dependencies: 205
-- Name: history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.history_id_seq', 24, true);


--
-- TOC entry 3934 (class 0 OID 0)
-- Dependencies: 209
-- Name: network_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.network_id_seq', 6, true);


--
-- TOC entry 3935 (class 0 OID 0)
-- Dependencies: 200
-- Name: symptoms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.symptoms_id_seq', 9, true);


--
-- TOC entry 3936 (class 0 OID 0)
-- Dependencies: 198
-- Name: user_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_status_id_seq', 4, true);


--
-- TOC entry 3937 (class 0 OID 0)
-- Dependencies: 207
-- Name: user_symptoms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_symptoms_id_seq', 1, false);


--
-- TOC entry 3761 (class 2606 OID 24941)
-- Name: confinement_states confinement_states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.confinement_states
    ADD CONSTRAINT confinement_states_pkey PRIMARY KEY (id);


--
-- TOC entry 3768 (class 2606 OID 24810)
-- Name: history history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_pkey PRIMARY KEY (id);


--
-- TOC entry 3776 (class 2606 OID 24885)
-- Name: network network_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network
    ADD CONSTRAINT network_pkey PRIMARY KEY (id);


--
-- TOC entry 3758 (class 2606 OID 24918)
-- Name: symptoms symptoms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.symptoms
    ADD CONSTRAINT symptoms_pkey PRIMARY KEY (id);


--
-- TOC entry 3755 (class 2606 OID 24916)
-- Name: user_status user_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_status
    ADD CONSTRAINT user_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3771 (class 2606 OID 24914)
-- Name: user_symptoms user_symptoms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_symptoms
    ADD CONSTRAINT user_symptoms_pkey PRIMARY KEY (id);


--
-- TOC entry 3765 (class 2606 OID 24795)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3759 (class 1259 OID 24785)
-- Name: confinement_states_id0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX confinement_states_id0 ON public.confinement_states USING btree (id);


--
-- TOC entry 3766 (class 1259 OID 24826)
-- Name: history_id0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX history_id0 ON public.history USING btree (user_id, "timestamp");


--
-- TOC entry 3772 (class 1259 OID 24857)
-- Name: network_id0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX network_id0 ON public.network USING btree (user_id);


--
-- TOC entry 3773 (class 1259 OID 24858)
-- Name: network_id1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX network_id1 ON public.network USING btree (met_with);


--
-- TOC entry 3774 (class 1259 OID 24859)
-- Name: network_id2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX network_id2 ON public.network USING btree (facebook_id);


--
-- TOC entry 3756 (class 1259 OID 24775)
-- Name: symptoms_id0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX symptoms_id0 ON public.symptoms USING btree (id);


--
-- TOC entry 3753 (class 1259 OID 24768)
-- Name: user_status_id0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_status_id0 ON public.user_status USING btree (id);


--
-- TOC entry 3769 (class 1259 OID 24845)
-- Name: user_symptoms_id0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_symptoms_id0 ON public.user_symptoms USING btree (id);


--
-- TOC entry 3762 (class 1259 OID 24796)
-- Name: users_id0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_id0 ON public.users USING btree (id);


--
-- TOC entry 3763 (class 1259 OID 24797)
-- Name: users_id1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_id1 ON public.users USING btree (facebook_id);


--
-- TOC entry 3782 (class 2606 OID 24878)
-- Name: example example_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.example
    ADD CONSTRAINT example_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3779 (class 2606 OID 24821)
-- Name: history history_confinement_state_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_confinement_state_fkey FOREIGN KEY (confinement_state) REFERENCES public.confinement_states(id);


--
-- TOC entry 3778 (class 2606 OID 24816)
-- Name: history history_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_status_fkey FOREIGN KEY (status) REFERENCES public.user_status(id);


--
-- TOC entry 3777 (class 2606 OID 24811)
-- Name: history history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3780 (class 2606 OID 24835)
-- Name: user_symptoms user_symptoms_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_symptoms
    ADD CONSTRAINT user_symptoms_history_id_fkey FOREIGN KEY (history_id) REFERENCES public.history(id);


--
-- TOC entry 3781 (class 2606 OID 24840)
-- Name: user_symptoms user_symptoms_symptom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_symptoms
    ADD CONSTRAINT user_symptoms_symptom_id_fkey FOREIGN KEY (symptom_id) REFERENCES public.symptoms(id);


--
-- TOC entry 3925 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM rdsadmin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2020-03-17 02:29:18

--
-- PostgreSQL database dump complete
--

