--
-- PostgreSQL database dump
--

\restrict o22b6eYgWAy79Q1i9jX6c9bVIhpejjE7FrfaxdNDZYfZbWp1dWwnOabJwhKhcai

-- Dumped from database version 17.8 (a48d9ca)
-- Dumped by pg_dump version 17.9 (Ubuntu 17.9-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: customer_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.customer_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public.customer_status OWNER TO neondb_owner;

--
-- Name: mpaa_rating; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.mpaa_rating AS ENUM (
    'G',
    'PG',
    'PG-13',
    'R',
    'NC-17'
);


ALTER TYPE public.mpaa_rating OWNER TO neondb_owner;

--
-- Name: release_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.release_status AS ENUM (
    'NOW_PLAYING',
    'COMING_SOON'
);


ALTER TYPE public.release_status OWNER TO neondb_owner;

--
-- Name: ticket_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.ticket_type AS ENUM (
    'ADULT',
    'SENIOR',
    'CHILD'
);


ALTER TYPE public.ticket_type OWNER TO neondb_owner;

--
-- Name: user_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_type AS ENUM (
    'ADMIN',
    'CUSTOMER'
);


ALTER TYPE public.user_type OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.actors (
    actor_id integer NOT NULL,
    actor_name character varying(200)
);


ALTER TABLE public.actors OWNER TO neondb_owner;

--
-- Name: actors_actor_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.actors_actor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.actors_actor_id_seq OWNER TO neondb_owner;

--
-- Name: actors_actor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.actors_actor_id_seq OWNED BY public.actors.actor_id;


--
-- Name: admins; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.admins (
    admin_id uuid NOT NULL,
    first_name character varying(100),
    last_name character varying(100)
);


ALTER TABLE public.admins OWNER TO neondb_owner;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bookings (
    booking_id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    show_id uuid NOT NULL,
    booking_fee double precision,
    total_price double precision,
    payment_reference character varying(100),
    promo_code character varying(50)
);


ALTER TABLE public.bookings OWNER TO neondb_owner;

--
-- Name: customer_favorite_movies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_favorite_movies (
    customer_id uuid NOT NULL,
    movie_id integer NOT NULL
);


ALTER TABLE public.customer_favorite_movies OWNER TO neondb_owner;

--
-- Name: customer_genre_preferences; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_genre_preferences (
    id integer NOT NULL,
    customer_id uuid NOT NULL,
    genre_id integer NOT NULL,
    preference_score integer DEFAULT 1
);


ALTER TABLE public.customer_genre_preferences OWNER TO neondb_owner;

--
-- Name: customer_genre_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.customer_genre_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_genre_preferences_id_seq OWNER TO neondb_owner;

--
-- Name: customer_genre_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.customer_genre_preferences_id_seq OWNED BY public.customer_genre_preferences.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customers (
    customer_id uuid NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    status public.customer_status DEFAULT 'ACTIVE'::public.customer_status NOT NULL
);


ALTER TABLE public.customers OWNER TO neondb_owner;

--
-- Name: directors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.directors (
    director_id integer NOT NULL,
    director_name character varying(200) NOT NULL
);


ALTER TABLE public.directors OWNER TO neondb_owner;

--
-- Name: directors_director_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.directors_director_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.directors_director_id_seq OWNER TO neondb_owner;

--
-- Name: directors_director_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.directors_director_id_seq OWNED BY public.directors.director_id;


--
-- Name: email_verifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.email_verifications (
    user_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.email_verifications OWNER TO neondb_owner;

--
-- Name: genres; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.genres (
    genre_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.genres OWNER TO neondb_owner;

--
-- Name: genres_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.genres_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genres_genre_id_seq OWNER TO neondb_owner;

--
-- Name: genres_genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.genres_genre_id_seq OWNED BY public.genres.genre_id;


--
-- Name: mailing_address; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mailing_address (
    id integer NOT NULL,
    customer_id uuid NOT NULL,
    address_line_1 character varying(255) NOT NULL,
    address_line_2 character varying(255),
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    postal_code character varying(20) NOT NULL,
    country character(2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.mailing_address OWNER TO neondb_owner;

--
-- Name: mailing_address_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mailing_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mailing_address_id_seq OWNER TO neondb_owner;

--
-- Name: mailing_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mailing_address_id_seq OWNED BY public.mailing_address.id;


--
-- Name: movie_casts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.movie_casts (
    movie_id integer NOT NULL,
    actor_id integer NOT NULL
);


ALTER TABLE public.movie_casts OWNER TO neondb_owner;

--
-- Name: movie_directors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.movie_directors (
    movie_id integer NOT NULL,
    director_id integer NOT NULL
);


ALTER TABLE public.movie_directors OWNER TO neondb_owner;

--
-- Name: movie_genres; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.movie_genres (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.movie_genres OWNER TO neondb_owner;

--
-- Name: movie_producers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.movie_producers (
    movie_id integer NOT NULL,
    producer_id integer NOT NULL
);


ALTER TABLE public.movie_producers OWNER TO neondb_owner;

--
-- Name: movies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.movies (
    movie_id integer NOT NULL,
    movie_name character varying(200) NOT NULL,
    category character varying(100),
    synopsis text,
    average_rating double precision,
    trailer character varying(300),
    trailer_image character varying(300),
    mpaa_us public.mpaa_rating,
    release_status public.release_status DEFAULT 'COMING_SOON'::public.release_status NOT NULL,
    runtime integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.movies OWNER TO neondb_owner;

--
-- Name: movies_movie_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.movies_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_movie_id_seq OWNER TO neondb_owner;

--
-- Name: movies_movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.movies_movie_id_seq OWNED BY public.movies.movie_id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.password_reset_tokens (
    user_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO neondb_owner;

--
-- Name: payment_method; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payment_method (
    id character varying(255) NOT NULL,
    customer_id uuid NOT NULL,
    billing_address_id integer,
    card_last_four character(4),
    card_brand character varying(50),
    card_exp_month integer,
    card_exp_year integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    card_number_encrypted text
);


ALTER TABLE public.payment_method OWNER TO neondb_owner;

--
-- Name: producers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.producers (
    producer_id integer NOT NULL,
    producer_name character varying(200) NOT NULL
);


ALTER TABLE public.producers OWNER TO neondb_owner;

--
-- Name: producers_producer_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.producers_producer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producers_producer_id_seq OWNER TO neondb_owner;

--
-- Name: producers_producer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.producers_producer_id_seq OWNED BY public.producers.producer_id;


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.promotions (
    promo_code character varying(50) NOT NULL,
    discount_amount double precision NOT NULL
);


ALTER TABLE public.promotions OWNER TO neondb_owner;

--
-- Name: seats; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.seats (
    seat_id integer NOT NULL,
    showroom_id integer NOT NULL,
    seat_number character varying(10) NOT NULL
);


ALTER TABLE public.seats OWNER TO neondb_owner;

--
-- Name: seats_seat_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.seats_seat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seats_seat_id_seq OWNER TO neondb_owner;

--
-- Name: seats_seat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.seats_seat_id_seq OWNED BY public.seats.seat_id;


--
-- Name: show_seats; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.show_seats (
    show_seat_id integer NOT NULL,
    show_id uuid NOT NULL,
    seat_id integer NOT NULL,
    is_available boolean DEFAULT true
);


ALTER TABLE public.show_seats OWNER TO neondb_owner;

--
-- Name: show_seats_show_seat_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.show_seats_show_seat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.show_seats_show_seat_id_seq OWNER TO neondb_owner;

--
-- Name: show_seats_show_seat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.show_seats_show_seat_id_seq OWNED BY public.show_seats.show_seat_id;


--
-- Name: showrooms; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.showrooms (
    showroom_id integer NOT NULL,
    theater_id integer NOT NULL,
    showroom_num integer NOT NULL,
    number_seats integer NOT NULL
);


ALTER TABLE public.showrooms OWNER TO neondb_owner;

--
-- Name: showrooms_showroom_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.showrooms_showroom_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.showrooms_showroom_id_seq OWNER TO neondb_owner;

--
-- Name: showrooms_showroom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.showrooms_showroom_id_seq OWNED BY public.showrooms.showroom_id;


--
-- Name: showtimes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.showtimes (
    show_id uuid DEFAULT gen_random_uuid() NOT NULL,
    showroom_id integer NOT NULL,
    movie_id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    "time" timestamp without time zone NOT NULL,
    duration integer NOT NULL
);


ALTER TABLE public.showtimes OWNER TO neondb_owner;

--
-- Name: theaters; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.theaters (
    theater_id integer NOT NULL,
    name character varying(200) NOT NULL
);


ALTER TABLE public.theaters OWNER TO neondb_owner;

--
-- Name: theaters_theater_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.theaters_theater_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.theaters_theater_id_seq OWNER TO neondb_owner;

--
-- Name: theaters_theater_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.theaters_theater_id_seq OWNED BY public.theaters.theater_id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tickets (
    ticket_number uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    show_seat_id integer NOT NULL,
    type public.ticket_type,
    price double precision NOT NULL
);


ALTER TABLE public.tickets OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(200) NOT NULL,
    password character varying(200) NOT NULL,
    phone_number character varying(50),
    receives_promos boolean DEFAULT false,
    user_type public.user_type NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    first_name text,
    last_name text
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: actors actor_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.actors ALTER COLUMN actor_id SET DEFAULT nextval('public.actors_actor_id_seq'::regclass);


--
-- Name: customer_genre_preferences id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_genre_preferences ALTER COLUMN id SET DEFAULT nextval('public.customer_genre_preferences_id_seq'::regclass);


--
-- Name: directors director_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.directors ALTER COLUMN director_id SET DEFAULT nextval('public.directors_director_id_seq'::regclass);


--
-- Name: genres genre_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.genres ALTER COLUMN genre_id SET DEFAULT nextval('public.genres_genre_id_seq'::regclass);


--
-- Name: mailing_address id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mailing_address ALTER COLUMN id SET DEFAULT nextval('public.mailing_address_id_seq'::regclass);


--
-- Name: movies movie_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq'::regclass);


--
-- Name: producers producer_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.producers ALTER COLUMN producer_id SET DEFAULT nextval('public.producers_producer_id_seq'::regclass);


--
-- Name: seats seat_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seats ALTER COLUMN seat_id SET DEFAULT nextval('public.seats_seat_id_seq'::regclass);


--
-- Name: show_seats show_seat_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.show_seats ALTER COLUMN show_seat_id SET DEFAULT nextval('public.show_seats_show_seat_id_seq'::regclass);


--
-- Name: showrooms showroom_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.showrooms ALTER COLUMN showroom_id SET DEFAULT nextval('public.showrooms_showroom_id_seq'::regclass);


--
-- Name: theaters theater_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.theaters ALTER COLUMN theater_id SET DEFAULT nextval('public.theaters_theater_id_seq'::regclass);


--
-- Data for Name: actors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.actors (actor_id, actor_name) FROM stdin;
1	Markiplier
2	Caroline Kaplan
3	Troy Baker
4	Keanu Reeves
5	Aziz Ansari
6	Seth Rogen
7	Keke Palmer
8	Jodie Corner
9	Alfie Williams
10	Aaron Taylor-Johnson
11	Ralph Fiennes
12	Timothee Chalamet
13	Gwyneth Paltrow
14	Odessa A'zion
15	Sebastian Stan
16	Renate Reinsve
17	Adam Pearson
18	Miles G. Jackson
19	Rachel McAdams
20	Dylan O'Brien
21	Edyll Ismail
22	Indy The Dog
23	Shane Jensen
24	Larry Fessenden
25	Madelaine Petsch
26	Richard Brake
27	Ema Horvath
28	Al Pacino
29	Steven Bauer
30	Michelle Pfeiffer
31	Joaquin Pheonix
32	Deirdre O'Connell
33	Emma Stone
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admins (admin_id, first_name, last_name) FROM stdin;
59d57e48-b907-4365-92c6-1029a2458333	\N	\N
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bookings (booking_id, customer_id, show_id, booking_fee, total_price, payment_reference, promo_code) FROM stdin;
\.


--
-- Data for Name: customer_favorite_movies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_favorite_movies (customer_id, movie_id) FROM stdin;
61c32904-52ec-432c-b694-420f659c39ad	3
1a63b501-9c4f-4a26-a75c-43151156ce60	8
c4a3fc06-7d73-4e29-bb42-b2afcef69d22	1
c4a3fc06-7d73-4e29-bb42-b2afcef69d22	4
c4a3fc06-7d73-4e29-bb42-b2afcef69d22	7
\.


--
-- Data for Name: customer_genre_preferences; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_genre_preferences (id, customer_id, genre_id, preference_score) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customers (customer_id, first_name, last_name, status) FROM stdin;
c4a3fc06-7d73-4e29-bb42-b2afcef69d22	\N	\N	ACTIVE
de58840c-29ac-404e-8bce-884eee20c49d	\N	\N	INACTIVE
61c32904-52ec-432c-b694-420f659c39ad	\N	\N	ACTIVE
9186b55b-dbba-46af-8c18-beeaa2a60a76	\N	\N	ACTIVE
1a63b501-9c4f-4a26-a75c-43151156ce60	\N	\N	ACTIVE
d7a51b45-85ea-4d31-8282-2351c514205f	\N	\N	ACTIVE
\.


--
-- Data for Name: directors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.directors (director_id, director_name) FROM stdin;
1	Markiplier
2	Aziz Ansari
3	Danny Boyle
4	Josh Safdie
5	Aaron Schimberg
6	Sam Raimi
7	Ben Leonberg
8	Renny Harlin
9	Brian De Palma
10	Ari Aster
\.


--
-- Data for Name: email_verifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.email_verifications (user_id, token, expires_at, created_at) FROM stdin;
de58840c-29ac-404e-8bce-884eee20c49d	d898a641f31f59f256910e53448e1d2a641539af5e36835bbfb16d488f6e1ba7	2026-04-12 19:16:10.460436	2026-04-11 19:16:10.460436
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.genres (genre_id, name) FROM stdin;
1	Sci-fi
2	Horror
3	Comedy
4	Thriller
5	Drama
6	Sport
7	Action
8	Crime
9	Western
\.


--
-- Data for Name: mailing_address; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mailing_address (id, customer_id, address_line_1, address_line_2, city, state, postal_code, country, created_at, updated_at) FROM stdin;
4	d7a51b45-85ea-4d31-8282-2351c514205f	3214	4321	fdw	4	3	3 	2026-03-30 18:26:16.119708	2026-03-30 18:26:16.119708
1	1a63b501-9c4f-4a26-a75c-43151156ce60	9325 Heatherton Walk testest	\N	Johns Creek	GA	30097	US	2026-03-30 17:11:57.288775	2026-04-07 22:36:33.886201
\.


--
-- Data for Name: movie_casts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.movie_casts (movie_id, actor_id) FROM stdin;
1	1
1	2
1	3
2	4
2	5
2	6
2	7
3	8
3	9
3	10
3	11
4	12
4	13
4	14
5	15
5	16
5	17
5	18
6	19
6	20
6	21
7	22
7	23
7	24
8	25
8	26
8	27
9	28
9	29
9	30
10	31
10	32
10	33
\.


--
-- Data for Name: movie_directors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.movie_directors (movie_id, director_id) FROM stdin;
1	1
2	2
3	3
4	4
5	5
6	6
7	7
8	8
9	9
10	10
\.


--
-- Data for Name: movie_genres; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.movie_genres (movie_id, genre_id) FROM stdin;
1	1
1	2
2	3
3	2
3	4
4	5
4	6
5	5
5	4
6	3
6	2
7	2
8	2
9	7
9	8
10	9
10	4
10	5
\.


--
-- Data for Name: movie_producers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.movie_producers (movie_id, producer_id) FROM stdin;
1	1
1	2
1	3
1	4
2	5
2	6
2	7
3	8
3	9
3	10
4	11
4	12
4	13
5	14
5	15
5	16
6	17
6	18
6	19
7	20
7	21
7	22
8	23
9	24
9	25
10	26
10	27
10	28
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.movies (movie_id, movie_name, category, synopsis, average_rating, trailer, trailer_image, mpaa_us, release_status, runtime) FROM stdin;
1	Iron Lung	Sci-fi/Horror	Survivors of the apocalypse send a convict in a small submarine to explore a desolate moon that's an ocean of blood.	6.1	https://www.youtube.com/watch?v=i4sh-Dw4bzg	/Movie_Posters/IronLung.jpg	R	NOW_PLAYING	127
2	Good Fortune	Comedy	A well-meaning but inept angel named Gabriel meddles in the lives of a struggling gig worker and a wealthy venture capitalist.	7.8	https://www.youtube.com/watch?v=ZKWndx83RwQ	/Movie_Posters/GoodFortune.jpeg	R	NOW_PLAYING	99
3	28 Years Later	Horror/Thriller	It's been almost three decades since the rage virus escaped from a biological weapons laboratory...	8.8	https://www.youtube.com/watch?v=IYGG55qwQZQ	/Movie_Posters/28YearsLater.jpg	R	NOW_PLAYING	115
9	Scarface	Action/Crime	After getting a green card in exchange for assassinating a Cuban government official...	7.8	https://www.youtube.com/watch?v=7pQQHnqBa2E	/Movie_Posters/Scarface.jpg	R	NOW_PLAYING	170
7	Goodboy	Horror	A man moves into a new home that has supernatural forces lurking in the shadows...	9	https://www.youtube.com/watch?v=q4-CRkd_74g	/Movie_Posters/Goodboy.jpeg	PG-13	NOW_PLAYING	73
8	Strangers Chapter 3	Horror	Curious about rumors of mannequins coming to life at night in a local store...	2	https://www.youtube.com/watch?v=yyAALuRTQ_w	/Movie_Posters/StrangersChapter3.jpg	PG-13	COMING_SOON	91
6	Send Help	Comedy/Horror	A woman and her overbearing boss become stranded on a deserted island after a plane crash...	9.4	https://www.youtube.com/watch?v=R4wiXj9NmEE	/Movie_Posters/SendHelp.jpg	PG-13	NOW_PLAYING	113
4	Marty Supreme	Drama/Sport	Marty Mauser, a wily hustler with a dream no one respects, goes to hell and back in pursuit of greatness.	9.4	https://www.youtube.com/watch?v=s9gSuKaKcqM	/Movie_Posters/MartySupreme.jpg	PG-13	NOW_PLAYING	150
5	A Different Man	Drama/Thriller	An aspiring actor undergoes a radical medical procedure to drastically transform his appearance...	6.9	https://www.youtube.com/watch?v=_9CmC5Rmsdw	/Movie_Posters/ADifferentMan.jpg	R	COMING_SOON	112
10	Eddington	Western/Thriller/Drama	During the COVID-19 pandemic, a standoff between a small-town sheriff and mayor sparks a powder keg...	6.8	https://www.youtube.com/watch?v=oL6jZqExlIk	/Movie_Posters/Eddington.jpeg	R	COMING_SOON	150
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.password_reset_tokens (user_id, token, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: payment_method; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payment_method (id, customer_id, billing_address_id, card_last_four, card_brand, card_exp_month, card_exp_year, created_at, updated_at, card_number_encrypted) FROM stdin;
e9a10ee7-0d93-4f4f-9fa4-7d34cf334e61	1a63b501-9c4f-4a26-a75c-43151156ce60	\N	6543	Discover	3	2030	2026-03-30 00:40:12.949338	2026-03-30 00:40:12.949338	cc7e603635967db13aa10d9c4aa0657d:6804a001ff9eef02d8f89402d4f4c535d26cdb5506486bb2f6458d0ca4f98dbd
f9882b52-98bb-4032-adfe-7291b4e0cf06	1a63b501-9c4f-4a26-a75c-43151156ce60	\N	4321	Visa	12	2030	2026-03-30 16:21:57.611013	2026-03-30 16:21:57.611013	625ef3c120105fc5264808fa42085546:fb2ea5d719074900bfd7c26671b928449612c74a88c2d43929d9894b9f0981b4
64e105ed-651e-4a0e-9e95-e309863db1b3	1a63b501-9c4f-4a26-a75c-43151156ce60	\N	5342	Mastercard	12	2030	2026-03-30 16:23:56.037412	2026-03-30 16:23:56.037412	90067e5e126ec8a8daf1ed37ee4c99b8:f2101e153fe4f3f3d042195051a53ba160648793aad032bbbcb115b3ee064f72
397e5ec1-4a7e-44e5-9d91-ea10e2f2ab21	d7a51b45-85ea-4d31-8282-2351c514205f	4	4343	Visa	12	2030	2026-03-30 18:26:16.169547	2026-03-30 18:26:16.169547	ede057719914f437f15aeafa66eb4e32:1c51e2e8ad7143568b4373ad916621c53320737869b96933935914825df3bc6a
\.


--
-- Data for Name: producers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.producers (producer_id, producer_name) FROM stdin;
1	Larissa Garcia-Baab
2	Jeff Guerrero
3	Will Hyde
4	Amy Nelson
5	Anthony Katagas
6	Alan Yang
7	Aziz Ansari
8	Danny Boyle
9	Alex Garland
10	Andrew Macdonald
11	Eli Bush
12	Timothee Chalamet
13	Ronald Bronstein
14	Christine Vachon
15	Vanessa McDonnell
16	Pamela Koffler
17	Sam Raimi
18	Zainab Azizi
19	Nicholas Simon
20	Kari Fischer
21	Ben Leonberg
22	Brian Goodheart
23	Courtney Solomon
24	Martin Bregman
25	Peter Saphier
26	Lars Knudsen
27	Ari Aster
28	Ann Ruark
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.promotions (promo_code, discount_amount) FROM stdin;
\.


--
-- Data for Name: seats; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.seats (seat_id, showroom_id, seat_number) FROM stdin;
1	1	A1
2	1	A2
3	1	A3
4	1	A4
5	1	A5
6	1	A6
7	1	A7
8	1	A8
9	1	A9
10	1	A10
11	1	B1
12	1	B2
13	1	B3
14	1	B4
15	1	B5
16	1	B6
17	1	B7
18	1	B8
19	1	B9
20	1	B10
21	1	B11
22	1	B12
23	1	C1
24	1	C2
25	1	C3
26	1	C4
27	1	C5
28	1	C6
29	1	C7
30	1	C8
31	1	C9
32	1	C10
33	1	C11
34	1	C12
35	1	C13
36	1	C14
37	1	D1
38	1	D2
39	1	D3
40	1	D4
41	1	D5
42	1	D6
43	1	D7
44	1	D8
45	1	D9
46	1	D10
47	1	D11
48	1	D12
49	1	E1
50	1	E2
51	1	E3
52	1	E4
53	1	E5
54	1	E6
55	1	E7
56	1	E8
57	1	E9
58	1	E10
59	1	F1
60	1	F2
61	1	F3
62	1	F4
63	1	F5
64	1	F6
65	1	F7
66	1	F8
67	1	F9
68	1	F10
69	1	F11
70	1	F12
71	1	G1
72	1	G2
73	1	G3
74	1	G4
75	1	G5
76	1	G6
77	1	G7
78	1	G8
79	1	G9
80	1	G10
81	1	G11
82	1	G12
83	1	G13
84	1	G14
85	1	H1
86	1	H2
87	1	H3
88	1	H4
89	1	H5
90	1	H6
91	1	H7
92	1	H8
93	1	H9
94	1	H10
95	1	H11
96	1	H12
97	2	A1
98	2	A2
99	2	A3
100	2	A4
101	2	A5
102	2	A6
103	2	A7
104	2	A8
105	2	A9
106	2	A10
107	2	B1
108	2	B2
109	2	B3
110	2	B4
111	2	B5
112	2	B6
113	2	B7
114	2	B8
115	2	B9
116	2	B10
117	2	B11
118	2	B12
119	2	C1
120	2	C2
121	2	C3
122	2	C4
123	2	C5
124	2	C6
125	2	C7
126	2	C8
127	2	C9
128	2	C10
129	2	C11
130	2	C12
131	2	C13
132	2	C14
133	2	D1
134	2	D2
135	2	D3
136	2	D4
137	2	D5
138	2	D6
139	2	D7
140	2	D8
141	2	D9
142	2	D10
143	2	D11
144	2	D12
145	2	E1
146	2	E2
147	2	E3
148	2	E4
149	2	E5
150	2	E6
151	2	E7
152	2	E8
153	2	E9
154	2	E10
155	2	F1
156	2	F2
157	2	F3
158	2	F4
159	2	F5
160	2	F6
161	2	F7
162	2	F8
163	2	F9
164	2	F10
165	2	F11
166	2	F12
167	2	G1
168	2	G2
169	2	G3
170	2	G4
171	2	G5
172	2	G6
173	2	G7
174	2	G8
175	2	G9
176	2	G10
177	2	G11
178	2	G12
179	2	G13
180	2	G14
181	2	H1
182	2	H2
183	2	H3
184	2	H4
185	2	H5
186	2	H6
187	2	H7
188	2	H8
189	2	H9
190	2	H10
191	2	H11
192	2	H12
\.


--
-- Data for Name: show_seats; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.show_seats (show_seat_id, show_id, seat_id, is_available) FROM stdin;
1	05713b51-d123-4e90-933f-900940b4f82d	1	t
2	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	1	t
3	5050a3e0-947b-4319-be05-15ac1d8c9def	1	t
4	5f5d1793-a7f4-438b-8344-06973689b35b	1	t
5	399ef9d7-e57a-497f-850f-4203986eb932	1	t
6	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	1	t
8	8039d3d3-260f-452a-a8c6-f59f427853b2	1	t
9	f0187098-7164-4557-a514-e4f12cab7b29	1	t
10	422bc56c-3368-415c-b822-5a701c607409	1	t
11	e1653523-be47-48cc-a3c0-d664104bfd4b	1	t
12	73a3a82e-468b-4665-92ae-5e9d5d0d432b	1	t
13	91778966-2712-4ad9-b278-6b0a96148cc1	1	t
14	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	1	t
15	6fc874f5-e524-4692-b482-6f15c5da413b	1	t
16	05713b51-d123-4e90-933f-900940b4f82d	2	t
17	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	2	t
18	5050a3e0-947b-4319-be05-15ac1d8c9def	2	t
19	5f5d1793-a7f4-438b-8344-06973689b35b	2	t
20	399ef9d7-e57a-497f-850f-4203986eb932	2	t
21	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	2	t
23	8039d3d3-260f-452a-a8c6-f59f427853b2	2	t
24	f0187098-7164-4557-a514-e4f12cab7b29	2	t
25	422bc56c-3368-415c-b822-5a701c607409	2	t
26	e1653523-be47-48cc-a3c0-d664104bfd4b	2	t
27	73a3a82e-468b-4665-92ae-5e9d5d0d432b	2	t
28	91778966-2712-4ad9-b278-6b0a96148cc1	2	t
29	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	2	t
30	6fc874f5-e524-4692-b482-6f15c5da413b	2	t
31	05713b51-d123-4e90-933f-900940b4f82d	3	t
32	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	3	t
33	5050a3e0-947b-4319-be05-15ac1d8c9def	3	t
34	5f5d1793-a7f4-438b-8344-06973689b35b	3	t
35	399ef9d7-e57a-497f-850f-4203986eb932	3	t
36	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	3	t
37	1fa3666d-771f-485f-ad36-69868c23d624	3	t
38	8039d3d3-260f-452a-a8c6-f59f427853b2	3	t
39	f0187098-7164-4557-a514-e4f12cab7b29	3	t
40	422bc56c-3368-415c-b822-5a701c607409	3	t
41	e1653523-be47-48cc-a3c0-d664104bfd4b	3	t
42	73a3a82e-468b-4665-92ae-5e9d5d0d432b	3	t
43	91778966-2712-4ad9-b278-6b0a96148cc1	3	t
44	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	3	t
45	6fc874f5-e524-4692-b482-6f15c5da413b	3	t
46	05713b51-d123-4e90-933f-900940b4f82d	4	t
47	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	4	t
48	5050a3e0-947b-4319-be05-15ac1d8c9def	4	t
49	5f5d1793-a7f4-438b-8344-06973689b35b	4	t
50	399ef9d7-e57a-497f-850f-4203986eb932	4	t
51	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	4	t
52	1fa3666d-771f-485f-ad36-69868c23d624	4	t
53	8039d3d3-260f-452a-a8c6-f59f427853b2	4	t
54	f0187098-7164-4557-a514-e4f12cab7b29	4	t
55	422bc56c-3368-415c-b822-5a701c607409	4	t
56	e1653523-be47-48cc-a3c0-d664104bfd4b	4	t
57	73a3a82e-468b-4665-92ae-5e9d5d0d432b	4	t
58	91778966-2712-4ad9-b278-6b0a96148cc1	4	t
59	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	4	t
60	6fc874f5-e524-4692-b482-6f15c5da413b	4	t
61	05713b51-d123-4e90-933f-900940b4f82d	5	t
62	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	5	t
63	5050a3e0-947b-4319-be05-15ac1d8c9def	5	t
64	5f5d1793-a7f4-438b-8344-06973689b35b	5	t
65	399ef9d7-e57a-497f-850f-4203986eb932	5	t
66	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	5	t
67	1fa3666d-771f-485f-ad36-69868c23d624	5	t
68	8039d3d3-260f-452a-a8c6-f59f427853b2	5	t
69	f0187098-7164-4557-a514-e4f12cab7b29	5	t
70	422bc56c-3368-415c-b822-5a701c607409	5	t
71	e1653523-be47-48cc-a3c0-d664104bfd4b	5	t
72	73a3a82e-468b-4665-92ae-5e9d5d0d432b	5	t
73	91778966-2712-4ad9-b278-6b0a96148cc1	5	t
74	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	5	t
75	6fc874f5-e524-4692-b482-6f15c5da413b	5	t
76	05713b51-d123-4e90-933f-900940b4f82d	6	t
77	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	6	t
78	5050a3e0-947b-4319-be05-15ac1d8c9def	6	t
79	5f5d1793-a7f4-438b-8344-06973689b35b	6	t
80	399ef9d7-e57a-497f-850f-4203986eb932	6	t
81	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	6	t
82	1fa3666d-771f-485f-ad36-69868c23d624	6	t
83	8039d3d3-260f-452a-a8c6-f59f427853b2	6	t
84	f0187098-7164-4557-a514-e4f12cab7b29	6	t
85	422bc56c-3368-415c-b822-5a701c607409	6	t
86	e1653523-be47-48cc-a3c0-d664104bfd4b	6	t
87	73a3a82e-468b-4665-92ae-5e9d5d0d432b	6	t
88	91778966-2712-4ad9-b278-6b0a96148cc1	6	t
89	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	6	t
90	6fc874f5-e524-4692-b482-6f15c5da413b	6	t
91	05713b51-d123-4e90-933f-900940b4f82d	7	t
92	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	7	t
93	5050a3e0-947b-4319-be05-15ac1d8c9def	7	t
94	5f5d1793-a7f4-438b-8344-06973689b35b	7	t
95	399ef9d7-e57a-497f-850f-4203986eb932	7	t
96	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	7	t
97	1fa3666d-771f-485f-ad36-69868c23d624	7	t
98	8039d3d3-260f-452a-a8c6-f59f427853b2	7	t
99	f0187098-7164-4557-a514-e4f12cab7b29	7	t
100	422bc56c-3368-415c-b822-5a701c607409	7	t
101	e1653523-be47-48cc-a3c0-d664104bfd4b	7	t
102	73a3a82e-468b-4665-92ae-5e9d5d0d432b	7	t
103	91778966-2712-4ad9-b278-6b0a96148cc1	7	t
104	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	7	t
105	6fc874f5-e524-4692-b482-6f15c5da413b	7	t
106	05713b51-d123-4e90-933f-900940b4f82d	8	t
107	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	8	t
108	5050a3e0-947b-4319-be05-15ac1d8c9def	8	t
109	5f5d1793-a7f4-438b-8344-06973689b35b	8	t
110	399ef9d7-e57a-497f-850f-4203986eb932	8	t
111	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	8	t
112	1fa3666d-771f-485f-ad36-69868c23d624	8	t
113	8039d3d3-260f-452a-a8c6-f59f427853b2	8	t
114	f0187098-7164-4557-a514-e4f12cab7b29	8	t
115	422bc56c-3368-415c-b822-5a701c607409	8	t
116	e1653523-be47-48cc-a3c0-d664104bfd4b	8	t
117	73a3a82e-468b-4665-92ae-5e9d5d0d432b	8	t
118	91778966-2712-4ad9-b278-6b0a96148cc1	8	t
119	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	8	t
120	6fc874f5-e524-4692-b482-6f15c5da413b	8	t
121	05713b51-d123-4e90-933f-900940b4f82d	9	t
122	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	9	t
123	5050a3e0-947b-4319-be05-15ac1d8c9def	9	t
124	5f5d1793-a7f4-438b-8344-06973689b35b	9	t
125	399ef9d7-e57a-497f-850f-4203986eb932	9	t
126	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	9	t
127	1fa3666d-771f-485f-ad36-69868c23d624	9	t
128	8039d3d3-260f-452a-a8c6-f59f427853b2	9	t
129	f0187098-7164-4557-a514-e4f12cab7b29	9	t
130	422bc56c-3368-415c-b822-5a701c607409	9	t
131	e1653523-be47-48cc-a3c0-d664104bfd4b	9	t
132	73a3a82e-468b-4665-92ae-5e9d5d0d432b	9	t
133	91778966-2712-4ad9-b278-6b0a96148cc1	9	t
134	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	9	t
135	6fc874f5-e524-4692-b482-6f15c5da413b	9	t
136	05713b51-d123-4e90-933f-900940b4f82d	10	t
137	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	10	t
138	5050a3e0-947b-4319-be05-15ac1d8c9def	10	t
139	5f5d1793-a7f4-438b-8344-06973689b35b	10	t
140	399ef9d7-e57a-497f-850f-4203986eb932	10	t
141	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	10	t
143	8039d3d3-260f-452a-a8c6-f59f427853b2	10	t
144	f0187098-7164-4557-a514-e4f12cab7b29	10	t
145	422bc56c-3368-415c-b822-5a701c607409	10	t
146	e1653523-be47-48cc-a3c0-d664104bfd4b	10	t
147	73a3a82e-468b-4665-92ae-5e9d5d0d432b	10	t
148	91778966-2712-4ad9-b278-6b0a96148cc1	10	t
149	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	10	t
150	6fc874f5-e524-4692-b482-6f15c5da413b	10	t
151	05713b51-d123-4e90-933f-900940b4f82d	11	t
152	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	11	t
153	5050a3e0-947b-4319-be05-15ac1d8c9def	11	t
154	5f5d1793-a7f4-438b-8344-06973689b35b	11	t
155	399ef9d7-e57a-497f-850f-4203986eb932	11	t
156	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	11	t
157	1fa3666d-771f-485f-ad36-69868c23d624	11	t
158	8039d3d3-260f-452a-a8c6-f59f427853b2	11	t
159	f0187098-7164-4557-a514-e4f12cab7b29	11	t
160	422bc56c-3368-415c-b822-5a701c607409	11	t
161	e1653523-be47-48cc-a3c0-d664104bfd4b	11	t
162	73a3a82e-468b-4665-92ae-5e9d5d0d432b	11	t
163	91778966-2712-4ad9-b278-6b0a96148cc1	11	t
164	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	11	t
165	6fc874f5-e524-4692-b482-6f15c5da413b	11	t
166	05713b51-d123-4e90-933f-900940b4f82d	12	t
167	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	12	t
168	5050a3e0-947b-4319-be05-15ac1d8c9def	12	t
169	5f5d1793-a7f4-438b-8344-06973689b35b	12	t
170	399ef9d7-e57a-497f-850f-4203986eb932	12	t
171	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	12	t
172	1fa3666d-771f-485f-ad36-69868c23d624	12	t
173	8039d3d3-260f-452a-a8c6-f59f427853b2	12	t
174	f0187098-7164-4557-a514-e4f12cab7b29	12	t
175	422bc56c-3368-415c-b822-5a701c607409	12	t
176	e1653523-be47-48cc-a3c0-d664104bfd4b	12	t
177	73a3a82e-468b-4665-92ae-5e9d5d0d432b	12	t
178	91778966-2712-4ad9-b278-6b0a96148cc1	12	t
179	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	12	t
180	6fc874f5-e524-4692-b482-6f15c5da413b	12	t
181	05713b51-d123-4e90-933f-900940b4f82d	13	t
182	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	13	t
183	5050a3e0-947b-4319-be05-15ac1d8c9def	13	t
184	5f5d1793-a7f4-438b-8344-06973689b35b	13	t
185	399ef9d7-e57a-497f-850f-4203986eb932	13	t
186	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	13	t
187	1fa3666d-771f-485f-ad36-69868c23d624	13	t
188	8039d3d3-260f-452a-a8c6-f59f427853b2	13	t
189	f0187098-7164-4557-a514-e4f12cab7b29	13	t
190	422bc56c-3368-415c-b822-5a701c607409	13	t
191	e1653523-be47-48cc-a3c0-d664104bfd4b	13	t
192	73a3a82e-468b-4665-92ae-5e9d5d0d432b	13	t
193	91778966-2712-4ad9-b278-6b0a96148cc1	13	t
194	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	13	t
195	6fc874f5-e524-4692-b482-6f15c5da413b	13	t
196	05713b51-d123-4e90-933f-900940b4f82d	14	t
197	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	14	t
198	5050a3e0-947b-4319-be05-15ac1d8c9def	14	t
199	5f5d1793-a7f4-438b-8344-06973689b35b	14	t
200	399ef9d7-e57a-497f-850f-4203986eb932	14	t
201	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	14	t
202	1fa3666d-771f-485f-ad36-69868c23d624	14	t
203	8039d3d3-260f-452a-a8c6-f59f427853b2	14	t
204	f0187098-7164-4557-a514-e4f12cab7b29	14	t
205	422bc56c-3368-415c-b822-5a701c607409	14	t
206	e1653523-be47-48cc-a3c0-d664104bfd4b	14	t
207	73a3a82e-468b-4665-92ae-5e9d5d0d432b	14	t
208	91778966-2712-4ad9-b278-6b0a96148cc1	14	t
209	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	14	t
210	6fc874f5-e524-4692-b482-6f15c5da413b	14	t
211	05713b51-d123-4e90-933f-900940b4f82d	15	t
212	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	15	t
213	5050a3e0-947b-4319-be05-15ac1d8c9def	15	t
214	5f5d1793-a7f4-438b-8344-06973689b35b	15	t
215	399ef9d7-e57a-497f-850f-4203986eb932	15	t
216	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	15	t
217	1fa3666d-771f-485f-ad36-69868c23d624	15	t
218	8039d3d3-260f-452a-a8c6-f59f427853b2	15	t
219	f0187098-7164-4557-a514-e4f12cab7b29	15	t
220	422bc56c-3368-415c-b822-5a701c607409	15	t
221	e1653523-be47-48cc-a3c0-d664104bfd4b	15	t
222	73a3a82e-468b-4665-92ae-5e9d5d0d432b	15	t
223	91778966-2712-4ad9-b278-6b0a96148cc1	15	t
224	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	15	t
225	6fc874f5-e524-4692-b482-6f15c5da413b	15	t
226	05713b51-d123-4e90-933f-900940b4f82d	16	t
227	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	16	t
228	5050a3e0-947b-4319-be05-15ac1d8c9def	16	t
229	5f5d1793-a7f4-438b-8344-06973689b35b	16	t
230	399ef9d7-e57a-497f-850f-4203986eb932	16	t
231	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	16	t
232	1fa3666d-771f-485f-ad36-69868c23d624	16	t
233	8039d3d3-260f-452a-a8c6-f59f427853b2	16	t
234	f0187098-7164-4557-a514-e4f12cab7b29	16	t
235	422bc56c-3368-415c-b822-5a701c607409	16	t
236	e1653523-be47-48cc-a3c0-d664104bfd4b	16	t
237	73a3a82e-468b-4665-92ae-5e9d5d0d432b	16	t
238	91778966-2712-4ad9-b278-6b0a96148cc1	16	t
239	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	16	t
240	6fc874f5-e524-4692-b482-6f15c5da413b	16	t
241	05713b51-d123-4e90-933f-900940b4f82d	17	t
242	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	17	t
243	5050a3e0-947b-4319-be05-15ac1d8c9def	17	t
244	5f5d1793-a7f4-438b-8344-06973689b35b	17	t
245	399ef9d7-e57a-497f-850f-4203986eb932	17	t
246	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	17	t
247	1fa3666d-771f-485f-ad36-69868c23d624	17	t
248	8039d3d3-260f-452a-a8c6-f59f427853b2	17	t
249	f0187098-7164-4557-a514-e4f12cab7b29	17	t
250	422bc56c-3368-415c-b822-5a701c607409	17	t
251	e1653523-be47-48cc-a3c0-d664104bfd4b	17	t
252	73a3a82e-468b-4665-92ae-5e9d5d0d432b	17	t
253	91778966-2712-4ad9-b278-6b0a96148cc1	17	t
254	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	17	t
255	6fc874f5-e524-4692-b482-6f15c5da413b	17	t
256	05713b51-d123-4e90-933f-900940b4f82d	18	t
257	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	18	t
258	5050a3e0-947b-4319-be05-15ac1d8c9def	18	t
259	5f5d1793-a7f4-438b-8344-06973689b35b	18	t
260	399ef9d7-e57a-497f-850f-4203986eb932	18	t
261	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	18	t
262	1fa3666d-771f-485f-ad36-69868c23d624	18	t
263	8039d3d3-260f-452a-a8c6-f59f427853b2	18	t
264	f0187098-7164-4557-a514-e4f12cab7b29	18	t
265	422bc56c-3368-415c-b822-5a701c607409	18	t
266	e1653523-be47-48cc-a3c0-d664104bfd4b	18	t
267	73a3a82e-468b-4665-92ae-5e9d5d0d432b	18	t
268	91778966-2712-4ad9-b278-6b0a96148cc1	18	t
269	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	18	t
270	6fc874f5-e524-4692-b482-6f15c5da413b	18	t
271	05713b51-d123-4e90-933f-900940b4f82d	19	t
272	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	19	t
273	5050a3e0-947b-4319-be05-15ac1d8c9def	19	t
274	5f5d1793-a7f4-438b-8344-06973689b35b	19	t
275	399ef9d7-e57a-497f-850f-4203986eb932	19	t
276	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	19	t
277	1fa3666d-771f-485f-ad36-69868c23d624	19	t
278	8039d3d3-260f-452a-a8c6-f59f427853b2	19	t
279	f0187098-7164-4557-a514-e4f12cab7b29	19	t
280	422bc56c-3368-415c-b822-5a701c607409	19	t
281	e1653523-be47-48cc-a3c0-d664104bfd4b	19	t
282	73a3a82e-468b-4665-92ae-5e9d5d0d432b	19	t
283	91778966-2712-4ad9-b278-6b0a96148cc1	19	t
284	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	19	t
285	6fc874f5-e524-4692-b482-6f15c5da413b	19	t
286	05713b51-d123-4e90-933f-900940b4f82d	20	t
287	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	20	t
288	5050a3e0-947b-4319-be05-15ac1d8c9def	20	t
289	5f5d1793-a7f4-438b-8344-06973689b35b	20	t
290	399ef9d7-e57a-497f-850f-4203986eb932	20	t
291	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	20	t
292	1fa3666d-771f-485f-ad36-69868c23d624	20	t
293	8039d3d3-260f-452a-a8c6-f59f427853b2	20	t
294	f0187098-7164-4557-a514-e4f12cab7b29	20	t
295	422bc56c-3368-415c-b822-5a701c607409	20	t
296	e1653523-be47-48cc-a3c0-d664104bfd4b	20	t
297	73a3a82e-468b-4665-92ae-5e9d5d0d432b	20	t
298	91778966-2712-4ad9-b278-6b0a96148cc1	20	t
299	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	20	t
300	6fc874f5-e524-4692-b482-6f15c5da413b	20	t
301	05713b51-d123-4e90-933f-900940b4f82d	21	t
302	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	21	t
303	5050a3e0-947b-4319-be05-15ac1d8c9def	21	t
304	5f5d1793-a7f4-438b-8344-06973689b35b	21	t
305	399ef9d7-e57a-497f-850f-4203986eb932	21	t
306	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	21	t
307	1fa3666d-771f-485f-ad36-69868c23d624	21	t
308	8039d3d3-260f-452a-a8c6-f59f427853b2	21	t
309	f0187098-7164-4557-a514-e4f12cab7b29	21	t
310	422bc56c-3368-415c-b822-5a701c607409	21	t
311	e1653523-be47-48cc-a3c0-d664104bfd4b	21	t
312	73a3a82e-468b-4665-92ae-5e9d5d0d432b	21	t
313	91778966-2712-4ad9-b278-6b0a96148cc1	21	t
314	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	21	t
315	6fc874f5-e524-4692-b482-6f15c5da413b	21	t
316	05713b51-d123-4e90-933f-900940b4f82d	22	t
317	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	22	t
318	5050a3e0-947b-4319-be05-15ac1d8c9def	22	t
319	5f5d1793-a7f4-438b-8344-06973689b35b	22	t
320	399ef9d7-e57a-497f-850f-4203986eb932	22	t
321	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	22	t
322	1fa3666d-771f-485f-ad36-69868c23d624	22	t
323	8039d3d3-260f-452a-a8c6-f59f427853b2	22	t
324	f0187098-7164-4557-a514-e4f12cab7b29	22	t
325	422bc56c-3368-415c-b822-5a701c607409	22	t
326	e1653523-be47-48cc-a3c0-d664104bfd4b	22	t
327	73a3a82e-468b-4665-92ae-5e9d5d0d432b	22	t
328	91778966-2712-4ad9-b278-6b0a96148cc1	22	t
329	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	22	t
330	6fc874f5-e524-4692-b482-6f15c5da413b	22	t
331	05713b51-d123-4e90-933f-900940b4f82d	23	t
332	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	23	t
333	5050a3e0-947b-4319-be05-15ac1d8c9def	23	t
334	5f5d1793-a7f4-438b-8344-06973689b35b	23	t
335	399ef9d7-e57a-497f-850f-4203986eb932	23	t
336	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	23	t
337	1fa3666d-771f-485f-ad36-69868c23d624	23	t
338	8039d3d3-260f-452a-a8c6-f59f427853b2	23	t
339	f0187098-7164-4557-a514-e4f12cab7b29	23	t
340	422bc56c-3368-415c-b822-5a701c607409	23	t
341	e1653523-be47-48cc-a3c0-d664104bfd4b	23	t
342	73a3a82e-468b-4665-92ae-5e9d5d0d432b	23	t
343	91778966-2712-4ad9-b278-6b0a96148cc1	23	t
344	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	23	t
345	6fc874f5-e524-4692-b482-6f15c5da413b	23	t
346	05713b51-d123-4e90-933f-900940b4f82d	24	t
347	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	24	t
348	5050a3e0-947b-4319-be05-15ac1d8c9def	24	t
349	5f5d1793-a7f4-438b-8344-06973689b35b	24	t
350	399ef9d7-e57a-497f-850f-4203986eb932	24	t
351	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	24	t
352	1fa3666d-771f-485f-ad36-69868c23d624	24	t
353	8039d3d3-260f-452a-a8c6-f59f427853b2	24	t
354	f0187098-7164-4557-a514-e4f12cab7b29	24	t
355	422bc56c-3368-415c-b822-5a701c607409	24	t
356	e1653523-be47-48cc-a3c0-d664104bfd4b	24	t
357	73a3a82e-468b-4665-92ae-5e9d5d0d432b	24	t
358	91778966-2712-4ad9-b278-6b0a96148cc1	24	t
359	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	24	t
360	6fc874f5-e524-4692-b482-6f15c5da413b	24	t
361	05713b51-d123-4e90-933f-900940b4f82d	25	t
362	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	25	t
363	5050a3e0-947b-4319-be05-15ac1d8c9def	25	t
364	5f5d1793-a7f4-438b-8344-06973689b35b	25	t
365	399ef9d7-e57a-497f-850f-4203986eb932	25	t
366	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	25	t
367	1fa3666d-771f-485f-ad36-69868c23d624	25	t
368	8039d3d3-260f-452a-a8c6-f59f427853b2	25	t
369	f0187098-7164-4557-a514-e4f12cab7b29	25	t
370	422bc56c-3368-415c-b822-5a701c607409	25	t
371	e1653523-be47-48cc-a3c0-d664104bfd4b	25	t
372	73a3a82e-468b-4665-92ae-5e9d5d0d432b	25	t
373	91778966-2712-4ad9-b278-6b0a96148cc1	25	t
374	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	25	t
375	6fc874f5-e524-4692-b482-6f15c5da413b	25	t
376	05713b51-d123-4e90-933f-900940b4f82d	26	t
377	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	26	t
378	5050a3e0-947b-4319-be05-15ac1d8c9def	26	t
379	5f5d1793-a7f4-438b-8344-06973689b35b	26	t
380	399ef9d7-e57a-497f-850f-4203986eb932	26	t
381	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	26	t
382	1fa3666d-771f-485f-ad36-69868c23d624	26	t
383	8039d3d3-260f-452a-a8c6-f59f427853b2	26	t
384	f0187098-7164-4557-a514-e4f12cab7b29	26	t
385	422bc56c-3368-415c-b822-5a701c607409	26	t
386	e1653523-be47-48cc-a3c0-d664104bfd4b	26	t
387	73a3a82e-468b-4665-92ae-5e9d5d0d432b	26	t
388	91778966-2712-4ad9-b278-6b0a96148cc1	26	t
389	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	26	t
390	6fc874f5-e524-4692-b482-6f15c5da413b	26	t
391	05713b51-d123-4e90-933f-900940b4f82d	27	t
392	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	27	t
393	5050a3e0-947b-4319-be05-15ac1d8c9def	27	t
394	5f5d1793-a7f4-438b-8344-06973689b35b	27	t
395	399ef9d7-e57a-497f-850f-4203986eb932	27	t
396	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	27	t
397	1fa3666d-771f-485f-ad36-69868c23d624	27	t
398	8039d3d3-260f-452a-a8c6-f59f427853b2	27	t
399	f0187098-7164-4557-a514-e4f12cab7b29	27	t
400	422bc56c-3368-415c-b822-5a701c607409	27	t
401	e1653523-be47-48cc-a3c0-d664104bfd4b	27	t
402	73a3a82e-468b-4665-92ae-5e9d5d0d432b	27	t
403	91778966-2712-4ad9-b278-6b0a96148cc1	27	t
404	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	27	t
405	6fc874f5-e524-4692-b482-6f15c5da413b	27	t
406	05713b51-d123-4e90-933f-900940b4f82d	28	t
407	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	28	t
408	5050a3e0-947b-4319-be05-15ac1d8c9def	28	t
409	5f5d1793-a7f4-438b-8344-06973689b35b	28	t
410	399ef9d7-e57a-497f-850f-4203986eb932	28	t
411	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	28	t
412	1fa3666d-771f-485f-ad36-69868c23d624	28	t
413	8039d3d3-260f-452a-a8c6-f59f427853b2	28	t
414	f0187098-7164-4557-a514-e4f12cab7b29	28	t
415	422bc56c-3368-415c-b822-5a701c607409	28	t
416	e1653523-be47-48cc-a3c0-d664104bfd4b	28	t
417	73a3a82e-468b-4665-92ae-5e9d5d0d432b	28	t
418	91778966-2712-4ad9-b278-6b0a96148cc1	28	t
419	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	28	t
420	6fc874f5-e524-4692-b482-6f15c5da413b	28	t
421	05713b51-d123-4e90-933f-900940b4f82d	29	t
422	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	29	t
423	5050a3e0-947b-4319-be05-15ac1d8c9def	29	t
424	5f5d1793-a7f4-438b-8344-06973689b35b	29	t
425	399ef9d7-e57a-497f-850f-4203986eb932	29	t
426	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	29	t
427	1fa3666d-771f-485f-ad36-69868c23d624	29	t
428	8039d3d3-260f-452a-a8c6-f59f427853b2	29	t
429	f0187098-7164-4557-a514-e4f12cab7b29	29	t
430	422bc56c-3368-415c-b822-5a701c607409	29	t
431	e1653523-be47-48cc-a3c0-d664104bfd4b	29	t
432	73a3a82e-468b-4665-92ae-5e9d5d0d432b	29	t
433	91778966-2712-4ad9-b278-6b0a96148cc1	29	t
434	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	29	t
435	6fc874f5-e524-4692-b482-6f15c5da413b	29	t
436	05713b51-d123-4e90-933f-900940b4f82d	30	t
437	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	30	t
438	5050a3e0-947b-4319-be05-15ac1d8c9def	30	t
439	5f5d1793-a7f4-438b-8344-06973689b35b	30	t
440	399ef9d7-e57a-497f-850f-4203986eb932	30	t
441	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	30	t
442	1fa3666d-771f-485f-ad36-69868c23d624	30	t
443	8039d3d3-260f-452a-a8c6-f59f427853b2	30	t
444	f0187098-7164-4557-a514-e4f12cab7b29	30	t
445	422bc56c-3368-415c-b822-5a701c607409	30	t
446	e1653523-be47-48cc-a3c0-d664104bfd4b	30	t
447	73a3a82e-468b-4665-92ae-5e9d5d0d432b	30	t
448	91778966-2712-4ad9-b278-6b0a96148cc1	30	t
449	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	30	t
450	6fc874f5-e524-4692-b482-6f15c5da413b	30	t
451	05713b51-d123-4e90-933f-900940b4f82d	31	t
452	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	31	t
453	5050a3e0-947b-4319-be05-15ac1d8c9def	31	t
454	5f5d1793-a7f4-438b-8344-06973689b35b	31	t
455	399ef9d7-e57a-497f-850f-4203986eb932	31	t
456	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	31	t
457	1fa3666d-771f-485f-ad36-69868c23d624	31	t
458	8039d3d3-260f-452a-a8c6-f59f427853b2	31	t
459	f0187098-7164-4557-a514-e4f12cab7b29	31	t
460	422bc56c-3368-415c-b822-5a701c607409	31	t
461	e1653523-be47-48cc-a3c0-d664104bfd4b	31	t
462	73a3a82e-468b-4665-92ae-5e9d5d0d432b	31	t
463	91778966-2712-4ad9-b278-6b0a96148cc1	31	t
464	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	31	t
465	6fc874f5-e524-4692-b482-6f15c5da413b	31	t
466	05713b51-d123-4e90-933f-900940b4f82d	32	t
467	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	32	t
468	5050a3e0-947b-4319-be05-15ac1d8c9def	32	t
469	5f5d1793-a7f4-438b-8344-06973689b35b	32	t
470	399ef9d7-e57a-497f-850f-4203986eb932	32	t
471	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	32	t
472	1fa3666d-771f-485f-ad36-69868c23d624	32	t
473	8039d3d3-260f-452a-a8c6-f59f427853b2	32	t
474	f0187098-7164-4557-a514-e4f12cab7b29	32	t
475	422bc56c-3368-415c-b822-5a701c607409	32	t
476	e1653523-be47-48cc-a3c0-d664104bfd4b	32	t
477	73a3a82e-468b-4665-92ae-5e9d5d0d432b	32	t
478	91778966-2712-4ad9-b278-6b0a96148cc1	32	t
479	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	32	t
480	6fc874f5-e524-4692-b482-6f15c5da413b	32	t
481	05713b51-d123-4e90-933f-900940b4f82d	33	t
482	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	33	t
483	5050a3e0-947b-4319-be05-15ac1d8c9def	33	t
484	5f5d1793-a7f4-438b-8344-06973689b35b	33	t
485	399ef9d7-e57a-497f-850f-4203986eb932	33	t
486	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	33	t
487	1fa3666d-771f-485f-ad36-69868c23d624	33	t
488	8039d3d3-260f-452a-a8c6-f59f427853b2	33	t
489	f0187098-7164-4557-a514-e4f12cab7b29	33	t
490	422bc56c-3368-415c-b822-5a701c607409	33	t
491	e1653523-be47-48cc-a3c0-d664104bfd4b	33	t
492	73a3a82e-468b-4665-92ae-5e9d5d0d432b	33	t
493	91778966-2712-4ad9-b278-6b0a96148cc1	33	t
494	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	33	t
495	6fc874f5-e524-4692-b482-6f15c5da413b	33	t
496	05713b51-d123-4e90-933f-900940b4f82d	34	t
497	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	34	t
498	5050a3e0-947b-4319-be05-15ac1d8c9def	34	t
499	5f5d1793-a7f4-438b-8344-06973689b35b	34	t
500	399ef9d7-e57a-497f-850f-4203986eb932	34	t
501	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	34	t
502	1fa3666d-771f-485f-ad36-69868c23d624	34	t
503	8039d3d3-260f-452a-a8c6-f59f427853b2	34	t
504	f0187098-7164-4557-a514-e4f12cab7b29	34	t
505	422bc56c-3368-415c-b822-5a701c607409	34	t
506	e1653523-be47-48cc-a3c0-d664104bfd4b	34	t
507	73a3a82e-468b-4665-92ae-5e9d5d0d432b	34	t
508	91778966-2712-4ad9-b278-6b0a96148cc1	34	t
509	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	34	t
510	6fc874f5-e524-4692-b482-6f15c5da413b	34	t
511	05713b51-d123-4e90-933f-900940b4f82d	35	t
512	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	35	t
513	5050a3e0-947b-4319-be05-15ac1d8c9def	35	t
514	5f5d1793-a7f4-438b-8344-06973689b35b	35	t
515	399ef9d7-e57a-497f-850f-4203986eb932	35	t
516	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	35	t
517	1fa3666d-771f-485f-ad36-69868c23d624	35	t
518	8039d3d3-260f-452a-a8c6-f59f427853b2	35	t
519	f0187098-7164-4557-a514-e4f12cab7b29	35	t
520	422bc56c-3368-415c-b822-5a701c607409	35	t
521	e1653523-be47-48cc-a3c0-d664104bfd4b	35	t
522	73a3a82e-468b-4665-92ae-5e9d5d0d432b	35	t
523	91778966-2712-4ad9-b278-6b0a96148cc1	35	t
524	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	35	t
525	6fc874f5-e524-4692-b482-6f15c5da413b	35	t
526	05713b51-d123-4e90-933f-900940b4f82d	36	t
527	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	36	t
528	5050a3e0-947b-4319-be05-15ac1d8c9def	36	t
529	5f5d1793-a7f4-438b-8344-06973689b35b	36	t
530	399ef9d7-e57a-497f-850f-4203986eb932	36	t
531	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	36	t
532	1fa3666d-771f-485f-ad36-69868c23d624	36	t
533	8039d3d3-260f-452a-a8c6-f59f427853b2	36	t
534	f0187098-7164-4557-a514-e4f12cab7b29	36	t
535	422bc56c-3368-415c-b822-5a701c607409	36	t
536	e1653523-be47-48cc-a3c0-d664104bfd4b	36	t
537	73a3a82e-468b-4665-92ae-5e9d5d0d432b	36	t
538	91778966-2712-4ad9-b278-6b0a96148cc1	36	t
539	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	36	t
540	6fc874f5-e524-4692-b482-6f15c5da413b	36	t
541	05713b51-d123-4e90-933f-900940b4f82d	37	t
542	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	37	t
543	5050a3e0-947b-4319-be05-15ac1d8c9def	37	t
544	5f5d1793-a7f4-438b-8344-06973689b35b	37	t
545	399ef9d7-e57a-497f-850f-4203986eb932	37	t
546	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	37	t
547	1fa3666d-771f-485f-ad36-69868c23d624	37	t
548	8039d3d3-260f-452a-a8c6-f59f427853b2	37	t
549	f0187098-7164-4557-a514-e4f12cab7b29	37	t
550	422bc56c-3368-415c-b822-5a701c607409	37	t
551	e1653523-be47-48cc-a3c0-d664104bfd4b	37	t
552	73a3a82e-468b-4665-92ae-5e9d5d0d432b	37	t
553	91778966-2712-4ad9-b278-6b0a96148cc1	37	t
554	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	37	t
555	6fc874f5-e524-4692-b482-6f15c5da413b	37	t
556	05713b51-d123-4e90-933f-900940b4f82d	38	t
557	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	38	t
558	5050a3e0-947b-4319-be05-15ac1d8c9def	38	t
559	5f5d1793-a7f4-438b-8344-06973689b35b	38	t
560	399ef9d7-e57a-497f-850f-4203986eb932	38	t
561	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	38	t
562	1fa3666d-771f-485f-ad36-69868c23d624	38	t
563	8039d3d3-260f-452a-a8c6-f59f427853b2	38	t
564	f0187098-7164-4557-a514-e4f12cab7b29	38	t
565	422bc56c-3368-415c-b822-5a701c607409	38	t
566	e1653523-be47-48cc-a3c0-d664104bfd4b	38	t
567	73a3a82e-468b-4665-92ae-5e9d5d0d432b	38	t
568	91778966-2712-4ad9-b278-6b0a96148cc1	38	t
569	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	38	t
570	6fc874f5-e524-4692-b482-6f15c5da413b	38	t
571	05713b51-d123-4e90-933f-900940b4f82d	39	t
572	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	39	t
573	5050a3e0-947b-4319-be05-15ac1d8c9def	39	t
574	5f5d1793-a7f4-438b-8344-06973689b35b	39	t
575	399ef9d7-e57a-497f-850f-4203986eb932	39	t
576	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	39	t
577	1fa3666d-771f-485f-ad36-69868c23d624	39	t
578	8039d3d3-260f-452a-a8c6-f59f427853b2	39	t
579	f0187098-7164-4557-a514-e4f12cab7b29	39	t
580	422bc56c-3368-415c-b822-5a701c607409	39	t
581	e1653523-be47-48cc-a3c0-d664104bfd4b	39	t
582	73a3a82e-468b-4665-92ae-5e9d5d0d432b	39	t
583	91778966-2712-4ad9-b278-6b0a96148cc1	39	t
584	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	39	t
585	6fc874f5-e524-4692-b482-6f15c5da413b	39	t
586	05713b51-d123-4e90-933f-900940b4f82d	40	t
587	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	40	t
588	5050a3e0-947b-4319-be05-15ac1d8c9def	40	t
589	5f5d1793-a7f4-438b-8344-06973689b35b	40	t
590	399ef9d7-e57a-497f-850f-4203986eb932	40	t
591	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	40	t
592	1fa3666d-771f-485f-ad36-69868c23d624	40	t
593	8039d3d3-260f-452a-a8c6-f59f427853b2	40	t
594	f0187098-7164-4557-a514-e4f12cab7b29	40	t
595	422bc56c-3368-415c-b822-5a701c607409	40	t
596	e1653523-be47-48cc-a3c0-d664104bfd4b	40	t
597	73a3a82e-468b-4665-92ae-5e9d5d0d432b	40	t
598	91778966-2712-4ad9-b278-6b0a96148cc1	40	t
599	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	40	t
600	6fc874f5-e524-4692-b482-6f15c5da413b	40	t
601	05713b51-d123-4e90-933f-900940b4f82d	41	t
602	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	41	t
603	5050a3e0-947b-4319-be05-15ac1d8c9def	41	t
604	5f5d1793-a7f4-438b-8344-06973689b35b	41	t
605	399ef9d7-e57a-497f-850f-4203986eb932	41	t
606	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	41	t
607	1fa3666d-771f-485f-ad36-69868c23d624	41	t
608	8039d3d3-260f-452a-a8c6-f59f427853b2	41	t
609	f0187098-7164-4557-a514-e4f12cab7b29	41	t
610	422bc56c-3368-415c-b822-5a701c607409	41	t
611	e1653523-be47-48cc-a3c0-d664104bfd4b	41	t
612	73a3a82e-468b-4665-92ae-5e9d5d0d432b	41	t
613	91778966-2712-4ad9-b278-6b0a96148cc1	41	t
614	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	41	t
615	6fc874f5-e524-4692-b482-6f15c5da413b	41	t
616	05713b51-d123-4e90-933f-900940b4f82d	42	t
617	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	42	t
618	5050a3e0-947b-4319-be05-15ac1d8c9def	42	t
619	5f5d1793-a7f4-438b-8344-06973689b35b	42	t
620	399ef9d7-e57a-497f-850f-4203986eb932	42	t
621	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	42	t
622	1fa3666d-771f-485f-ad36-69868c23d624	42	t
623	8039d3d3-260f-452a-a8c6-f59f427853b2	42	t
624	f0187098-7164-4557-a514-e4f12cab7b29	42	t
625	422bc56c-3368-415c-b822-5a701c607409	42	t
626	e1653523-be47-48cc-a3c0-d664104bfd4b	42	t
627	73a3a82e-468b-4665-92ae-5e9d5d0d432b	42	t
628	91778966-2712-4ad9-b278-6b0a96148cc1	42	t
629	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	42	t
630	6fc874f5-e524-4692-b482-6f15c5da413b	42	t
631	05713b51-d123-4e90-933f-900940b4f82d	43	t
632	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	43	t
633	5050a3e0-947b-4319-be05-15ac1d8c9def	43	t
634	5f5d1793-a7f4-438b-8344-06973689b35b	43	t
635	399ef9d7-e57a-497f-850f-4203986eb932	43	t
636	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	43	t
637	1fa3666d-771f-485f-ad36-69868c23d624	43	t
638	8039d3d3-260f-452a-a8c6-f59f427853b2	43	t
639	f0187098-7164-4557-a514-e4f12cab7b29	43	t
640	422bc56c-3368-415c-b822-5a701c607409	43	t
641	e1653523-be47-48cc-a3c0-d664104bfd4b	43	t
642	73a3a82e-468b-4665-92ae-5e9d5d0d432b	43	t
643	91778966-2712-4ad9-b278-6b0a96148cc1	43	t
644	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	43	t
645	6fc874f5-e524-4692-b482-6f15c5da413b	43	t
646	05713b51-d123-4e90-933f-900940b4f82d	44	t
647	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	44	t
648	5050a3e0-947b-4319-be05-15ac1d8c9def	44	t
649	5f5d1793-a7f4-438b-8344-06973689b35b	44	t
650	399ef9d7-e57a-497f-850f-4203986eb932	44	t
651	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	44	t
652	1fa3666d-771f-485f-ad36-69868c23d624	44	t
653	8039d3d3-260f-452a-a8c6-f59f427853b2	44	t
654	f0187098-7164-4557-a514-e4f12cab7b29	44	t
655	422bc56c-3368-415c-b822-5a701c607409	44	t
656	e1653523-be47-48cc-a3c0-d664104bfd4b	44	t
657	73a3a82e-468b-4665-92ae-5e9d5d0d432b	44	t
658	91778966-2712-4ad9-b278-6b0a96148cc1	44	t
659	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	44	t
660	6fc874f5-e524-4692-b482-6f15c5da413b	44	t
661	05713b51-d123-4e90-933f-900940b4f82d	45	t
662	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	45	t
663	5050a3e0-947b-4319-be05-15ac1d8c9def	45	t
664	5f5d1793-a7f4-438b-8344-06973689b35b	45	t
665	399ef9d7-e57a-497f-850f-4203986eb932	45	t
666	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	45	t
667	1fa3666d-771f-485f-ad36-69868c23d624	45	t
668	8039d3d3-260f-452a-a8c6-f59f427853b2	45	t
669	f0187098-7164-4557-a514-e4f12cab7b29	45	t
670	422bc56c-3368-415c-b822-5a701c607409	45	t
671	e1653523-be47-48cc-a3c0-d664104bfd4b	45	t
672	73a3a82e-468b-4665-92ae-5e9d5d0d432b	45	t
673	91778966-2712-4ad9-b278-6b0a96148cc1	45	t
674	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	45	t
675	6fc874f5-e524-4692-b482-6f15c5da413b	45	t
676	05713b51-d123-4e90-933f-900940b4f82d	46	t
677	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	46	t
678	5050a3e0-947b-4319-be05-15ac1d8c9def	46	t
679	5f5d1793-a7f4-438b-8344-06973689b35b	46	t
680	399ef9d7-e57a-497f-850f-4203986eb932	46	t
681	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	46	t
682	1fa3666d-771f-485f-ad36-69868c23d624	46	t
683	8039d3d3-260f-452a-a8c6-f59f427853b2	46	t
684	f0187098-7164-4557-a514-e4f12cab7b29	46	t
685	422bc56c-3368-415c-b822-5a701c607409	46	t
686	e1653523-be47-48cc-a3c0-d664104bfd4b	46	t
687	73a3a82e-468b-4665-92ae-5e9d5d0d432b	46	t
688	91778966-2712-4ad9-b278-6b0a96148cc1	46	t
689	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	46	t
690	6fc874f5-e524-4692-b482-6f15c5da413b	46	t
691	05713b51-d123-4e90-933f-900940b4f82d	47	t
692	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	47	t
693	5050a3e0-947b-4319-be05-15ac1d8c9def	47	t
694	5f5d1793-a7f4-438b-8344-06973689b35b	47	t
695	399ef9d7-e57a-497f-850f-4203986eb932	47	t
696	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	47	t
697	1fa3666d-771f-485f-ad36-69868c23d624	47	t
698	8039d3d3-260f-452a-a8c6-f59f427853b2	47	t
699	f0187098-7164-4557-a514-e4f12cab7b29	47	t
700	422bc56c-3368-415c-b822-5a701c607409	47	t
701	e1653523-be47-48cc-a3c0-d664104bfd4b	47	t
702	73a3a82e-468b-4665-92ae-5e9d5d0d432b	47	t
703	91778966-2712-4ad9-b278-6b0a96148cc1	47	t
704	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	47	t
705	6fc874f5-e524-4692-b482-6f15c5da413b	47	t
706	05713b51-d123-4e90-933f-900940b4f82d	48	t
707	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	48	t
708	5050a3e0-947b-4319-be05-15ac1d8c9def	48	t
709	5f5d1793-a7f4-438b-8344-06973689b35b	48	t
710	399ef9d7-e57a-497f-850f-4203986eb932	48	t
711	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	48	t
712	1fa3666d-771f-485f-ad36-69868c23d624	48	t
713	8039d3d3-260f-452a-a8c6-f59f427853b2	48	t
714	f0187098-7164-4557-a514-e4f12cab7b29	48	t
715	422bc56c-3368-415c-b822-5a701c607409	48	t
716	e1653523-be47-48cc-a3c0-d664104bfd4b	48	t
717	73a3a82e-468b-4665-92ae-5e9d5d0d432b	48	t
718	91778966-2712-4ad9-b278-6b0a96148cc1	48	t
719	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	48	t
720	6fc874f5-e524-4692-b482-6f15c5da413b	48	t
721	05713b51-d123-4e90-933f-900940b4f82d	49	t
722	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	49	t
723	5050a3e0-947b-4319-be05-15ac1d8c9def	49	t
724	5f5d1793-a7f4-438b-8344-06973689b35b	49	t
725	399ef9d7-e57a-497f-850f-4203986eb932	49	t
726	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	49	t
727	1fa3666d-771f-485f-ad36-69868c23d624	49	t
728	8039d3d3-260f-452a-a8c6-f59f427853b2	49	t
729	f0187098-7164-4557-a514-e4f12cab7b29	49	t
730	422bc56c-3368-415c-b822-5a701c607409	49	t
731	e1653523-be47-48cc-a3c0-d664104bfd4b	49	t
732	73a3a82e-468b-4665-92ae-5e9d5d0d432b	49	t
733	91778966-2712-4ad9-b278-6b0a96148cc1	49	t
734	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	49	t
735	6fc874f5-e524-4692-b482-6f15c5da413b	49	t
736	05713b51-d123-4e90-933f-900940b4f82d	50	t
737	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	50	t
738	5050a3e0-947b-4319-be05-15ac1d8c9def	50	t
739	5f5d1793-a7f4-438b-8344-06973689b35b	50	t
740	399ef9d7-e57a-497f-850f-4203986eb932	50	t
741	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	50	t
742	1fa3666d-771f-485f-ad36-69868c23d624	50	t
743	8039d3d3-260f-452a-a8c6-f59f427853b2	50	t
744	f0187098-7164-4557-a514-e4f12cab7b29	50	t
745	422bc56c-3368-415c-b822-5a701c607409	50	t
746	e1653523-be47-48cc-a3c0-d664104bfd4b	50	t
747	73a3a82e-468b-4665-92ae-5e9d5d0d432b	50	t
748	91778966-2712-4ad9-b278-6b0a96148cc1	50	t
749	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	50	t
750	6fc874f5-e524-4692-b482-6f15c5da413b	50	t
751	05713b51-d123-4e90-933f-900940b4f82d	51	t
752	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	51	t
753	5050a3e0-947b-4319-be05-15ac1d8c9def	51	t
754	5f5d1793-a7f4-438b-8344-06973689b35b	51	t
755	399ef9d7-e57a-497f-850f-4203986eb932	51	t
756	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	51	t
757	1fa3666d-771f-485f-ad36-69868c23d624	51	t
758	8039d3d3-260f-452a-a8c6-f59f427853b2	51	t
759	f0187098-7164-4557-a514-e4f12cab7b29	51	t
760	422bc56c-3368-415c-b822-5a701c607409	51	t
761	e1653523-be47-48cc-a3c0-d664104bfd4b	51	t
762	73a3a82e-468b-4665-92ae-5e9d5d0d432b	51	t
763	91778966-2712-4ad9-b278-6b0a96148cc1	51	t
764	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	51	t
765	6fc874f5-e524-4692-b482-6f15c5da413b	51	t
766	05713b51-d123-4e90-933f-900940b4f82d	52	t
767	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	52	t
768	5050a3e0-947b-4319-be05-15ac1d8c9def	52	t
769	5f5d1793-a7f4-438b-8344-06973689b35b	52	t
770	399ef9d7-e57a-497f-850f-4203986eb932	52	t
771	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	52	t
772	1fa3666d-771f-485f-ad36-69868c23d624	52	t
773	8039d3d3-260f-452a-a8c6-f59f427853b2	52	t
774	f0187098-7164-4557-a514-e4f12cab7b29	52	t
775	422bc56c-3368-415c-b822-5a701c607409	52	t
776	e1653523-be47-48cc-a3c0-d664104bfd4b	52	t
777	73a3a82e-468b-4665-92ae-5e9d5d0d432b	52	t
778	91778966-2712-4ad9-b278-6b0a96148cc1	52	t
779	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	52	t
780	6fc874f5-e524-4692-b482-6f15c5da413b	52	t
781	05713b51-d123-4e90-933f-900940b4f82d	53	t
782	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	53	t
783	5050a3e0-947b-4319-be05-15ac1d8c9def	53	t
784	5f5d1793-a7f4-438b-8344-06973689b35b	53	t
785	399ef9d7-e57a-497f-850f-4203986eb932	53	t
786	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	53	t
787	1fa3666d-771f-485f-ad36-69868c23d624	53	t
788	8039d3d3-260f-452a-a8c6-f59f427853b2	53	t
789	f0187098-7164-4557-a514-e4f12cab7b29	53	t
790	422bc56c-3368-415c-b822-5a701c607409	53	t
791	e1653523-be47-48cc-a3c0-d664104bfd4b	53	t
792	73a3a82e-468b-4665-92ae-5e9d5d0d432b	53	t
793	91778966-2712-4ad9-b278-6b0a96148cc1	53	t
794	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	53	t
795	6fc874f5-e524-4692-b482-6f15c5da413b	53	t
796	05713b51-d123-4e90-933f-900940b4f82d	54	t
797	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	54	t
798	5050a3e0-947b-4319-be05-15ac1d8c9def	54	t
799	5f5d1793-a7f4-438b-8344-06973689b35b	54	t
800	399ef9d7-e57a-497f-850f-4203986eb932	54	t
801	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	54	t
802	1fa3666d-771f-485f-ad36-69868c23d624	54	t
803	8039d3d3-260f-452a-a8c6-f59f427853b2	54	t
804	f0187098-7164-4557-a514-e4f12cab7b29	54	t
805	422bc56c-3368-415c-b822-5a701c607409	54	t
806	e1653523-be47-48cc-a3c0-d664104bfd4b	54	t
807	73a3a82e-468b-4665-92ae-5e9d5d0d432b	54	t
808	91778966-2712-4ad9-b278-6b0a96148cc1	54	t
809	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	54	t
810	6fc874f5-e524-4692-b482-6f15c5da413b	54	t
811	05713b51-d123-4e90-933f-900940b4f82d	55	t
812	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	55	t
813	5050a3e0-947b-4319-be05-15ac1d8c9def	55	t
814	5f5d1793-a7f4-438b-8344-06973689b35b	55	t
815	399ef9d7-e57a-497f-850f-4203986eb932	55	t
816	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	55	t
817	1fa3666d-771f-485f-ad36-69868c23d624	55	t
818	8039d3d3-260f-452a-a8c6-f59f427853b2	55	t
819	f0187098-7164-4557-a514-e4f12cab7b29	55	t
820	422bc56c-3368-415c-b822-5a701c607409	55	t
821	e1653523-be47-48cc-a3c0-d664104bfd4b	55	t
822	73a3a82e-468b-4665-92ae-5e9d5d0d432b	55	t
823	91778966-2712-4ad9-b278-6b0a96148cc1	55	t
824	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	55	t
825	6fc874f5-e524-4692-b482-6f15c5da413b	55	t
826	05713b51-d123-4e90-933f-900940b4f82d	56	t
827	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	56	t
828	5050a3e0-947b-4319-be05-15ac1d8c9def	56	t
829	5f5d1793-a7f4-438b-8344-06973689b35b	56	t
830	399ef9d7-e57a-497f-850f-4203986eb932	56	t
831	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	56	t
832	1fa3666d-771f-485f-ad36-69868c23d624	56	t
833	8039d3d3-260f-452a-a8c6-f59f427853b2	56	t
834	f0187098-7164-4557-a514-e4f12cab7b29	56	t
835	422bc56c-3368-415c-b822-5a701c607409	56	t
836	e1653523-be47-48cc-a3c0-d664104bfd4b	56	t
837	73a3a82e-468b-4665-92ae-5e9d5d0d432b	56	t
838	91778966-2712-4ad9-b278-6b0a96148cc1	56	t
839	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	56	t
840	6fc874f5-e524-4692-b482-6f15c5da413b	56	t
841	05713b51-d123-4e90-933f-900940b4f82d	57	t
842	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	57	t
843	5050a3e0-947b-4319-be05-15ac1d8c9def	57	t
844	5f5d1793-a7f4-438b-8344-06973689b35b	57	t
845	399ef9d7-e57a-497f-850f-4203986eb932	57	t
846	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	57	t
847	1fa3666d-771f-485f-ad36-69868c23d624	57	t
848	8039d3d3-260f-452a-a8c6-f59f427853b2	57	t
849	f0187098-7164-4557-a514-e4f12cab7b29	57	t
850	422bc56c-3368-415c-b822-5a701c607409	57	t
851	e1653523-be47-48cc-a3c0-d664104bfd4b	57	t
852	73a3a82e-468b-4665-92ae-5e9d5d0d432b	57	t
853	91778966-2712-4ad9-b278-6b0a96148cc1	57	t
854	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	57	t
855	6fc874f5-e524-4692-b482-6f15c5da413b	57	t
856	05713b51-d123-4e90-933f-900940b4f82d	58	t
857	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	58	t
858	5050a3e0-947b-4319-be05-15ac1d8c9def	58	t
859	5f5d1793-a7f4-438b-8344-06973689b35b	58	t
860	399ef9d7-e57a-497f-850f-4203986eb932	58	t
861	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	58	t
862	1fa3666d-771f-485f-ad36-69868c23d624	58	t
863	8039d3d3-260f-452a-a8c6-f59f427853b2	58	t
864	f0187098-7164-4557-a514-e4f12cab7b29	58	t
865	422bc56c-3368-415c-b822-5a701c607409	58	t
866	e1653523-be47-48cc-a3c0-d664104bfd4b	58	t
867	73a3a82e-468b-4665-92ae-5e9d5d0d432b	58	t
868	91778966-2712-4ad9-b278-6b0a96148cc1	58	t
869	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	58	t
870	6fc874f5-e524-4692-b482-6f15c5da413b	58	t
871	05713b51-d123-4e90-933f-900940b4f82d	59	t
872	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	59	t
873	5050a3e0-947b-4319-be05-15ac1d8c9def	59	t
874	5f5d1793-a7f4-438b-8344-06973689b35b	59	t
875	399ef9d7-e57a-497f-850f-4203986eb932	59	t
876	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	59	t
877	1fa3666d-771f-485f-ad36-69868c23d624	59	t
878	8039d3d3-260f-452a-a8c6-f59f427853b2	59	t
879	f0187098-7164-4557-a514-e4f12cab7b29	59	t
880	422bc56c-3368-415c-b822-5a701c607409	59	t
881	e1653523-be47-48cc-a3c0-d664104bfd4b	59	t
882	73a3a82e-468b-4665-92ae-5e9d5d0d432b	59	t
883	91778966-2712-4ad9-b278-6b0a96148cc1	59	t
884	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	59	t
885	6fc874f5-e524-4692-b482-6f15c5da413b	59	t
886	05713b51-d123-4e90-933f-900940b4f82d	60	t
887	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	60	t
888	5050a3e0-947b-4319-be05-15ac1d8c9def	60	t
889	5f5d1793-a7f4-438b-8344-06973689b35b	60	t
890	399ef9d7-e57a-497f-850f-4203986eb932	60	t
891	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	60	t
892	1fa3666d-771f-485f-ad36-69868c23d624	60	t
893	8039d3d3-260f-452a-a8c6-f59f427853b2	60	t
894	f0187098-7164-4557-a514-e4f12cab7b29	60	t
895	422bc56c-3368-415c-b822-5a701c607409	60	t
896	e1653523-be47-48cc-a3c0-d664104bfd4b	60	t
897	73a3a82e-468b-4665-92ae-5e9d5d0d432b	60	t
898	91778966-2712-4ad9-b278-6b0a96148cc1	60	t
899	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	60	t
900	6fc874f5-e524-4692-b482-6f15c5da413b	60	t
901	05713b51-d123-4e90-933f-900940b4f82d	61	t
902	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	61	t
903	5050a3e0-947b-4319-be05-15ac1d8c9def	61	t
904	5f5d1793-a7f4-438b-8344-06973689b35b	61	t
905	399ef9d7-e57a-497f-850f-4203986eb932	61	t
906	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	61	t
907	1fa3666d-771f-485f-ad36-69868c23d624	61	t
908	8039d3d3-260f-452a-a8c6-f59f427853b2	61	t
909	f0187098-7164-4557-a514-e4f12cab7b29	61	t
910	422bc56c-3368-415c-b822-5a701c607409	61	t
911	e1653523-be47-48cc-a3c0-d664104bfd4b	61	t
912	73a3a82e-468b-4665-92ae-5e9d5d0d432b	61	t
913	91778966-2712-4ad9-b278-6b0a96148cc1	61	t
914	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	61	t
915	6fc874f5-e524-4692-b482-6f15c5da413b	61	t
916	05713b51-d123-4e90-933f-900940b4f82d	62	t
917	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	62	t
918	5050a3e0-947b-4319-be05-15ac1d8c9def	62	t
919	5f5d1793-a7f4-438b-8344-06973689b35b	62	t
920	399ef9d7-e57a-497f-850f-4203986eb932	62	t
921	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	62	t
922	1fa3666d-771f-485f-ad36-69868c23d624	62	t
923	8039d3d3-260f-452a-a8c6-f59f427853b2	62	t
924	f0187098-7164-4557-a514-e4f12cab7b29	62	t
925	422bc56c-3368-415c-b822-5a701c607409	62	t
926	e1653523-be47-48cc-a3c0-d664104bfd4b	62	t
927	73a3a82e-468b-4665-92ae-5e9d5d0d432b	62	t
928	91778966-2712-4ad9-b278-6b0a96148cc1	62	t
929	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	62	t
930	6fc874f5-e524-4692-b482-6f15c5da413b	62	t
931	05713b51-d123-4e90-933f-900940b4f82d	63	t
932	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	63	t
933	5050a3e0-947b-4319-be05-15ac1d8c9def	63	t
934	5f5d1793-a7f4-438b-8344-06973689b35b	63	t
935	399ef9d7-e57a-497f-850f-4203986eb932	63	t
936	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	63	t
937	1fa3666d-771f-485f-ad36-69868c23d624	63	t
938	8039d3d3-260f-452a-a8c6-f59f427853b2	63	t
939	f0187098-7164-4557-a514-e4f12cab7b29	63	t
940	422bc56c-3368-415c-b822-5a701c607409	63	t
941	e1653523-be47-48cc-a3c0-d664104bfd4b	63	t
942	73a3a82e-468b-4665-92ae-5e9d5d0d432b	63	t
943	91778966-2712-4ad9-b278-6b0a96148cc1	63	t
944	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	63	t
945	6fc874f5-e524-4692-b482-6f15c5da413b	63	t
946	05713b51-d123-4e90-933f-900940b4f82d	64	t
947	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	64	t
948	5050a3e0-947b-4319-be05-15ac1d8c9def	64	t
949	5f5d1793-a7f4-438b-8344-06973689b35b	64	t
950	399ef9d7-e57a-497f-850f-4203986eb932	64	t
951	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	64	t
952	1fa3666d-771f-485f-ad36-69868c23d624	64	t
953	8039d3d3-260f-452a-a8c6-f59f427853b2	64	t
954	f0187098-7164-4557-a514-e4f12cab7b29	64	t
955	422bc56c-3368-415c-b822-5a701c607409	64	t
956	e1653523-be47-48cc-a3c0-d664104bfd4b	64	t
957	73a3a82e-468b-4665-92ae-5e9d5d0d432b	64	t
958	91778966-2712-4ad9-b278-6b0a96148cc1	64	t
959	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	64	t
960	6fc874f5-e524-4692-b482-6f15c5da413b	64	t
961	05713b51-d123-4e90-933f-900940b4f82d	65	t
962	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	65	t
963	5050a3e0-947b-4319-be05-15ac1d8c9def	65	t
964	5f5d1793-a7f4-438b-8344-06973689b35b	65	t
965	399ef9d7-e57a-497f-850f-4203986eb932	65	t
966	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	65	t
967	1fa3666d-771f-485f-ad36-69868c23d624	65	t
968	8039d3d3-260f-452a-a8c6-f59f427853b2	65	t
969	f0187098-7164-4557-a514-e4f12cab7b29	65	t
970	422bc56c-3368-415c-b822-5a701c607409	65	t
971	e1653523-be47-48cc-a3c0-d664104bfd4b	65	t
972	73a3a82e-468b-4665-92ae-5e9d5d0d432b	65	t
973	91778966-2712-4ad9-b278-6b0a96148cc1	65	t
974	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	65	t
975	6fc874f5-e524-4692-b482-6f15c5da413b	65	t
976	05713b51-d123-4e90-933f-900940b4f82d	66	t
977	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	66	t
978	5050a3e0-947b-4319-be05-15ac1d8c9def	66	t
979	5f5d1793-a7f4-438b-8344-06973689b35b	66	t
980	399ef9d7-e57a-497f-850f-4203986eb932	66	t
981	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	66	t
982	1fa3666d-771f-485f-ad36-69868c23d624	66	t
983	8039d3d3-260f-452a-a8c6-f59f427853b2	66	t
984	f0187098-7164-4557-a514-e4f12cab7b29	66	t
985	422bc56c-3368-415c-b822-5a701c607409	66	t
986	e1653523-be47-48cc-a3c0-d664104bfd4b	66	t
987	73a3a82e-468b-4665-92ae-5e9d5d0d432b	66	t
988	91778966-2712-4ad9-b278-6b0a96148cc1	66	t
989	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	66	t
990	6fc874f5-e524-4692-b482-6f15c5da413b	66	t
991	05713b51-d123-4e90-933f-900940b4f82d	67	t
992	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	67	t
993	5050a3e0-947b-4319-be05-15ac1d8c9def	67	t
994	5f5d1793-a7f4-438b-8344-06973689b35b	67	t
995	399ef9d7-e57a-497f-850f-4203986eb932	67	t
996	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	67	t
997	1fa3666d-771f-485f-ad36-69868c23d624	67	t
998	8039d3d3-260f-452a-a8c6-f59f427853b2	67	t
999	f0187098-7164-4557-a514-e4f12cab7b29	67	t
1000	422bc56c-3368-415c-b822-5a701c607409	67	t
1001	e1653523-be47-48cc-a3c0-d664104bfd4b	67	t
1002	73a3a82e-468b-4665-92ae-5e9d5d0d432b	67	t
1003	91778966-2712-4ad9-b278-6b0a96148cc1	67	t
1004	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	67	t
1005	6fc874f5-e524-4692-b482-6f15c5da413b	67	t
1006	05713b51-d123-4e90-933f-900940b4f82d	68	t
1007	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	68	t
1008	5050a3e0-947b-4319-be05-15ac1d8c9def	68	t
1009	5f5d1793-a7f4-438b-8344-06973689b35b	68	t
1010	399ef9d7-e57a-497f-850f-4203986eb932	68	t
1011	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	68	t
1012	1fa3666d-771f-485f-ad36-69868c23d624	68	t
1013	8039d3d3-260f-452a-a8c6-f59f427853b2	68	t
1014	f0187098-7164-4557-a514-e4f12cab7b29	68	t
1015	422bc56c-3368-415c-b822-5a701c607409	68	t
1016	e1653523-be47-48cc-a3c0-d664104bfd4b	68	t
1017	73a3a82e-468b-4665-92ae-5e9d5d0d432b	68	t
1018	91778966-2712-4ad9-b278-6b0a96148cc1	68	t
1019	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	68	t
1020	6fc874f5-e524-4692-b482-6f15c5da413b	68	t
1021	05713b51-d123-4e90-933f-900940b4f82d	69	t
1022	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	69	t
1023	5050a3e0-947b-4319-be05-15ac1d8c9def	69	t
1024	5f5d1793-a7f4-438b-8344-06973689b35b	69	t
1025	399ef9d7-e57a-497f-850f-4203986eb932	69	t
1026	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	69	t
1027	1fa3666d-771f-485f-ad36-69868c23d624	69	t
1028	8039d3d3-260f-452a-a8c6-f59f427853b2	69	t
1029	f0187098-7164-4557-a514-e4f12cab7b29	69	t
1030	422bc56c-3368-415c-b822-5a701c607409	69	t
1031	e1653523-be47-48cc-a3c0-d664104bfd4b	69	t
1032	73a3a82e-468b-4665-92ae-5e9d5d0d432b	69	t
1033	91778966-2712-4ad9-b278-6b0a96148cc1	69	t
1034	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	69	t
1035	6fc874f5-e524-4692-b482-6f15c5da413b	69	t
1036	05713b51-d123-4e90-933f-900940b4f82d	70	t
1037	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	70	t
1038	5050a3e0-947b-4319-be05-15ac1d8c9def	70	t
1039	5f5d1793-a7f4-438b-8344-06973689b35b	70	t
1040	399ef9d7-e57a-497f-850f-4203986eb932	70	t
1041	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	70	t
1042	1fa3666d-771f-485f-ad36-69868c23d624	70	t
1043	8039d3d3-260f-452a-a8c6-f59f427853b2	70	t
1044	f0187098-7164-4557-a514-e4f12cab7b29	70	t
1045	422bc56c-3368-415c-b822-5a701c607409	70	t
1046	e1653523-be47-48cc-a3c0-d664104bfd4b	70	t
1047	73a3a82e-468b-4665-92ae-5e9d5d0d432b	70	t
1048	91778966-2712-4ad9-b278-6b0a96148cc1	70	t
1049	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	70	t
1050	6fc874f5-e524-4692-b482-6f15c5da413b	70	t
1051	05713b51-d123-4e90-933f-900940b4f82d	71	t
1052	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	71	t
1053	5050a3e0-947b-4319-be05-15ac1d8c9def	71	t
1054	5f5d1793-a7f4-438b-8344-06973689b35b	71	t
1055	399ef9d7-e57a-497f-850f-4203986eb932	71	t
1056	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	71	t
1057	1fa3666d-771f-485f-ad36-69868c23d624	71	t
1058	8039d3d3-260f-452a-a8c6-f59f427853b2	71	t
1059	f0187098-7164-4557-a514-e4f12cab7b29	71	t
1060	422bc56c-3368-415c-b822-5a701c607409	71	t
1061	e1653523-be47-48cc-a3c0-d664104bfd4b	71	t
1062	73a3a82e-468b-4665-92ae-5e9d5d0d432b	71	t
1063	91778966-2712-4ad9-b278-6b0a96148cc1	71	t
1064	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	71	t
1065	6fc874f5-e524-4692-b482-6f15c5da413b	71	t
1066	05713b51-d123-4e90-933f-900940b4f82d	72	t
1067	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	72	t
1068	5050a3e0-947b-4319-be05-15ac1d8c9def	72	t
1069	5f5d1793-a7f4-438b-8344-06973689b35b	72	t
1070	399ef9d7-e57a-497f-850f-4203986eb932	72	t
1071	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	72	t
1072	1fa3666d-771f-485f-ad36-69868c23d624	72	t
1073	8039d3d3-260f-452a-a8c6-f59f427853b2	72	t
1074	f0187098-7164-4557-a514-e4f12cab7b29	72	t
1075	422bc56c-3368-415c-b822-5a701c607409	72	t
1076	e1653523-be47-48cc-a3c0-d664104bfd4b	72	t
1077	73a3a82e-468b-4665-92ae-5e9d5d0d432b	72	t
1078	91778966-2712-4ad9-b278-6b0a96148cc1	72	t
1079	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	72	t
1080	6fc874f5-e524-4692-b482-6f15c5da413b	72	t
1081	05713b51-d123-4e90-933f-900940b4f82d	73	t
1082	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	73	t
1083	5050a3e0-947b-4319-be05-15ac1d8c9def	73	t
1084	5f5d1793-a7f4-438b-8344-06973689b35b	73	t
1085	399ef9d7-e57a-497f-850f-4203986eb932	73	t
1086	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	73	t
1087	1fa3666d-771f-485f-ad36-69868c23d624	73	t
1088	8039d3d3-260f-452a-a8c6-f59f427853b2	73	t
1089	f0187098-7164-4557-a514-e4f12cab7b29	73	t
1090	422bc56c-3368-415c-b822-5a701c607409	73	t
1091	e1653523-be47-48cc-a3c0-d664104bfd4b	73	t
1092	73a3a82e-468b-4665-92ae-5e9d5d0d432b	73	t
1093	91778966-2712-4ad9-b278-6b0a96148cc1	73	t
1094	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	73	t
1095	6fc874f5-e524-4692-b482-6f15c5da413b	73	t
1096	05713b51-d123-4e90-933f-900940b4f82d	74	t
1097	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	74	t
1098	5050a3e0-947b-4319-be05-15ac1d8c9def	74	t
1099	5f5d1793-a7f4-438b-8344-06973689b35b	74	t
1100	399ef9d7-e57a-497f-850f-4203986eb932	74	t
1101	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	74	t
1102	1fa3666d-771f-485f-ad36-69868c23d624	74	t
1103	8039d3d3-260f-452a-a8c6-f59f427853b2	74	t
1104	f0187098-7164-4557-a514-e4f12cab7b29	74	t
1105	422bc56c-3368-415c-b822-5a701c607409	74	t
1106	e1653523-be47-48cc-a3c0-d664104bfd4b	74	t
1107	73a3a82e-468b-4665-92ae-5e9d5d0d432b	74	t
1108	91778966-2712-4ad9-b278-6b0a96148cc1	74	t
1109	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	74	t
1110	6fc874f5-e524-4692-b482-6f15c5da413b	74	t
1111	05713b51-d123-4e90-933f-900940b4f82d	75	t
1112	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	75	t
1113	5050a3e0-947b-4319-be05-15ac1d8c9def	75	t
1114	5f5d1793-a7f4-438b-8344-06973689b35b	75	t
1115	399ef9d7-e57a-497f-850f-4203986eb932	75	t
1116	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	75	t
1117	1fa3666d-771f-485f-ad36-69868c23d624	75	t
1118	8039d3d3-260f-452a-a8c6-f59f427853b2	75	t
1119	f0187098-7164-4557-a514-e4f12cab7b29	75	t
1120	422bc56c-3368-415c-b822-5a701c607409	75	t
1121	e1653523-be47-48cc-a3c0-d664104bfd4b	75	t
1122	73a3a82e-468b-4665-92ae-5e9d5d0d432b	75	t
1123	91778966-2712-4ad9-b278-6b0a96148cc1	75	t
1124	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	75	t
1125	6fc874f5-e524-4692-b482-6f15c5da413b	75	t
1126	05713b51-d123-4e90-933f-900940b4f82d	76	t
1127	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	76	t
1128	5050a3e0-947b-4319-be05-15ac1d8c9def	76	t
1129	5f5d1793-a7f4-438b-8344-06973689b35b	76	t
1130	399ef9d7-e57a-497f-850f-4203986eb932	76	t
1131	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	76	t
1132	1fa3666d-771f-485f-ad36-69868c23d624	76	t
1133	8039d3d3-260f-452a-a8c6-f59f427853b2	76	t
1134	f0187098-7164-4557-a514-e4f12cab7b29	76	t
1135	422bc56c-3368-415c-b822-5a701c607409	76	t
1136	e1653523-be47-48cc-a3c0-d664104bfd4b	76	t
1137	73a3a82e-468b-4665-92ae-5e9d5d0d432b	76	t
1138	91778966-2712-4ad9-b278-6b0a96148cc1	76	t
1139	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	76	t
1140	6fc874f5-e524-4692-b482-6f15c5da413b	76	t
1141	05713b51-d123-4e90-933f-900940b4f82d	77	t
1142	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	77	t
1143	5050a3e0-947b-4319-be05-15ac1d8c9def	77	t
1144	5f5d1793-a7f4-438b-8344-06973689b35b	77	t
1145	399ef9d7-e57a-497f-850f-4203986eb932	77	t
1146	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	77	t
1147	1fa3666d-771f-485f-ad36-69868c23d624	77	t
1148	8039d3d3-260f-452a-a8c6-f59f427853b2	77	t
1149	f0187098-7164-4557-a514-e4f12cab7b29	77	t
1150	422bc56c-3368-415c-b822-5a701c607409	77	t
1151	e1653523-be47-48cc-a3c0-d664104bfd4b	77	t
1152	73a3a82e-468b-4665-92ae-5e9d5d0d432b	77	t
1153	91778966-2712-4ad9-b278-6b0a96148cc1	77	t
1154	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	77	t
1155	6fc874f5-e524-4692-b482-6f15c5da413b	77	t
1156	05713b51-d123-4e90-933f-900940b4f82d	78	t
1157	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	78	t
1158	5050a3e0-947b-4319-be05-15ac1d8c9def	78	t
1159	5f5d1793-a7f4-438b-8344-06973689b35b	78	t
1160	399ef9d7-e57a-497f-850f-4203986eb932	78	t
1161	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	78	t
1162	1fa3666d-771f-485f-ad36-69868c23d624	78	t
1163	8039d3d3-260f-452a-a8c6-f59f427853b2	78	t
1164	f0187098-7164-4557-a514-e4f12cab7b29	78	t
1165	422bc56c-3368-415c-b822-5a701c607409	78	t
1166	e1653523-be47-48cc-a3c0-d664104bfd4b	78	t
1167	73a3a82e-468b-4665-92ae-5e9d5d0d432b	78	t
1168	91778966-2712-4ad9-b278-6b0a96148cc1	78	t
1169	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	78	t
1170	6fc874f5-e524-4692-b482-6f15c5da413b	78	t
1171	05713b51-d123-4e90-933f-900940b4f82d	79	t
1172	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	79	t
1173	5050a3e0-947b-4319-be05-15ac1d8c9def	79	t
1174	5f5d1793-a7f4-438b-8344-06973689b35b	79	t
1175	399ef9d7-e57a-497f-850f-4203986eb932	79	t
1176	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	79	t
1177	1fa3666d-771f-485f-ad36-69868c23d624	79	t
1178	8039d3d3-260f-452a-a8c6-f59f427853b2	79	t
1179	f0187098-7164-4557-a514-e4f12cab7b29	79	t
1180	422bc56c-3368-415c-b822-5a701c607409	79	t
1181	e1653523-be47-48cc-a3c0-d664104bfd4b	79	t
1182	73a3a82e-468b-4665-92ae-5e9d5d0d432b	79	t
1183	91778966-2712-4ad9-b278-6b0a96148cc1	79	t
1184	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	79	t
1185	6fc874f5-e524-4692-b482-6f15c5da413b	79	t
1186	05713b51-d123-4e90-933f-900940b4f82d	80	t
1187	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	80	t
1188	5050a3e0-947b-4319-be05-15ac1d8c9def	80	t
1189	5f5d1793-a7f4-438b-8344-06973689b35b	80	t
1190	399ef9d7-e57a-497f-850f-4203986eb932	80	t
1191	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	80	t
1192	1fa3666d-771f-485f-ad36-69868c23d624	80	t
1193	8039d3d3-260f-452a-a8c6-f59f427853b2	80	t
1194	f0187098-7164-4557-a514-e4f12cab7b29	80	t
1195	422bc56c-3368-415c-b822-5a701c607409	80	t
1196	e1653523-be47-48cc-a3c0-d664104bfd4b	80	t
1197	73a3a82e-468b-4665-92ae-5e9d5d0d432b	80	t
1198	91778966-2712-4ad9-b278-6b0a96148cc1	80	t
1199	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	80	t
1200	6fc874f5-e524-4692-b482-6f15c5da413b	80	t
1201	05713b51-d123-4e90-933f-900940b4f82d	81	t
1202	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	81	t
1203	5050a3e0-947b-4319-be05-15ac1d8c9def	81	t
1204	5f5d1793-a7f4-438b-8344-06973689b35b	81	t
1205	399ef9d7-e57a-497f-850f-4203986eb932	81	t
1206	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	81	t
1207	1fa3666d-771f-485f-ad36-69868c23d624	81	t
1208	8039d3d3-260f-452a-a8c6-f59f427853b2	81	t
1209	f0187098-7164-4557-a514-e4f12cab7b29	81	t
1210	422bc56c-3368-415c-b822-5a701c607409	81	t
1211	e1653523-be47-48cc-a3c0-d664104bfd4b	81	t
1212	73a3a82e-468b-4665-92ae-5e9d5d0d432b	81	t
1213	91778966-2712-4ad9-b278-6b0a96148cc1	81	t
1214	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	81	t
1215	6fc874f5-e524-4692-b482-6f15c5da413b	81	t
1216	05713b51-d123-4e90-933f-900940b4f82d	82	t
1217	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	82	t
1218	5050a3e0-947b-4319-be05-15ac1d8c9def	82	t
1219	5f5d1793-a7f4-438b-8344-06973689b35b	82	t
1220	399ef9d7-e57a-497f-850f-4203986eb932	82	t
1221	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	82	t
1222	1fa3666d-771f-485f-ad36-69868c23d624	82	t
1223	8039d3d3-260f-452a-a8c6-f59f427853b2	82	t
1224	f0187098-7164-4557-a514-e4f12cab7b29	82	t
1225	422bc56c-3368-415c-b822-5a701c607409	82	t
1226	e1653523-be47-48cc-a3c0-d664104bfd4b	82	t
1227	73a3a82e-468b-4665-92ae-5e9d5d0d432b	82	t
1228	91778966-2712-4ad9-b278-6b0a96148cc1	82	t
1229	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	82	t
1230	6fc874f5-e524-4692-b482-6f15c5da413b	82	t
1231	05713b51-d123-4e90-933f-900940b4f82d	83	t
1232	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	83	t
1233	5050a3e0-947b-4319-be05-15ac1d8c9def	83	t
1234	5f5d1793-a7f4-438b-8344-06973689b35b	83	t
1235	399ef9d7-e57a-497f-850f-4203986eb932	83	t
1236	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	83	t
1237	1fa3666d-771f-485f-ad36-69868c23d624	83	t
1238	8039d3d3-260f-452a-a8c6-f59f427853b2	83	t
1239	f0187098-7164-4557-a514-e4f12cab7b29	83	t
1240	422bc56c-3368-415c-b822-5a701c607409	83	t
1241	e1653523-be47-48cc-a3c0-d664104bfd4b	83	t
1242	73a3a82e-468b-4665-92ae-5e9d5d0d432b	83	t
1243	91778966-2712-4ad9-b278-6b0a96148cc1	83	t
1244	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	83	t
1245	6fc874f5-e524-4692-b482-6f15c5da413b	83	t
1246	05713b51-d123-4e90-933f-900940b4f82d	84	t
1247	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	84	t
1248	5050a3e0-947b-4319-be05-15ac1d8c9def	84	t
1249	5f5d1793-a7f4-438b-8344-06973689b35b	84	t
1250	399ef9d7-e57a-497f-850f-4203986eb932	84	t
1251	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	84	t
1252	1fa3666d-771f-485f-ad36-69868c23d624	84	t
1253	8039d3d3-260f-452a-a8c6-f59f427853b2	84	t
1254	f0187098-7164-4557-a514-e4f12cab7b29	84	t
1255	422bc56c-3368-415c-b822-5a701c607409	84	t
1256	e1653523-be47-48cc-a3c0-d664104bfd4b	84	t
1257	73a3a82e-468b-4665-92ae-5e9d5d0d432b	84	t
1258	91778966-2712-4ad9-b278-6b0a96148cc1	84	t
1259	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	84	t
1260	6fc874f5-e524-4692-b482-6f15c5da413b	84	t
1261	05713b51-d123-4e90-933f-900940b4f82d	85	t
1262	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	85	t
1263	5050a3e0-947b-4319-be05-15ac1d8c9def	85	t
1264	5f5d1793-a7f4-438b-8344-06973689b35b	85	t
1265	399ef9d7-e57a-497f-850f-4203986eb932	85	t
1266	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	85	t
1267	1fa3666d-771f-485f-ad36-69868c23d624	85	t
1268	8039d3d3-260f-452a-a8c6-f59f427853b2	85	t
1269	f0187098-7164-4557-a514-e4f12cab7b29	85	t
1270	422bc56c-3368-415c-b822-5a701c607409	85	t
1271	e1653523-be47-48cc-a3c0-d664104bfd4b	85	t
1272	73a3a82e-468b-4665-92ae-5e9d5d0d432b	85	t
1273	91778966-2712-4ad9-b278-6b0a96148cc1	85	t
1274	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	85	t
1275	6fc874f5-e524-4692-b482-6f15c5da413b	85	t
1276	05713b51-d123-4e90-933f-900940b4f82d	86	t
1277	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	86	t
1278	5050a3e0-947b-4319-be05-15ac1d8c9def	86	t
1279	5f5d1793-a7f4-438b-8344-06973689b35b	86	t
1280	399ef9d7-e57a-497f-850f-4203986eb932	86	t
1281	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	86	t
1282	1fa3666d-771f-485f-ad36-69868c23d624	86	t
1283	8039d3d3-260f-452a-a8c6-f59f427853b2	86	t
1284	f0187098-7164-4557-a514-e4f12cab7b29	86	t
1285	422bc56c-3368-415c-b822-5a701c607409	86	t
1286	e1653523-be47-48cc-a3c0-d664104bfd4b	86	t
1287	73a3a82e-468b-4665-92ae-5e9d5d0d432b	86	t
1288	91778966-2712-4ad9-b278-6b0a96148cc1	86	t
1289	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	86	t
1290	6fc874f5-e524-4692-b482-6f15c5da413b	86	t
1291	05713b51-d123-4e90-933f-900940b4f82d	87	t
1292	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	87	t
1293	5050a3e0-947b-4319-be05-15ac1d8c9def	87	t
1294	5f5d1793-a7f4-438b-8344-06973689b35b	87	t
1295	399ef9d7-e57a-497f-850f-4203986eb932	87	t
1296	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	87	t
1297	1fa3666d-771f-485f-ad36-69868c23d624	87	t
1298	8039d3d3-260f-452a-a8c6-f59f427853b2	87	t
1299	f0187098-7164-4557-a514-e4f12cab7b29	87	t
1300	422bc56c-3368-415c-b822-5a701c607409	87	t
1301	e1653523-be47-48cc-a3c0-d664104bfd4b	87	t
1302	73a3a82e-468b-4665-92ae-5e9d5d0d432b	87	t
1303	91778966-2712-4ad9-b278-6b0a96148cc1	87	t
1304	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	87	t
1305	6fc874f5-e524-4692-b482-6f15c5da413b	87	t
1306	05713b51-d123-4e90-933f-900940b4f82d	88	t
1307	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	88	t
1308	5050a3e0-947b-4319-be05-15ac1d8c9def	88	t
1309	5f5d1793-a7f4-438b-8344-06973689b35b	88	t
1310	399ef9d7-e57a-497f-850f-4203986eb932	88	t
1311	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	88	t
1312	1fa3666d-771f-485f-ad36-69868c23d624	88	t
1313	8039d3d3-260f-452a-a8c6-f59f427853b2	88	t
1314	f0187098-7164-4557-a514-e4f12cab7b29	88	t
1315	422bc56c-3368-415c-b822-5a701c607409	88	t
1316	e1653523-be47-48cc-a3c0-d664104bfd4b	88	t
1317	73a3a82e-468b-4665-92ae-5e9d5d0d432b	88	t
1318	91778966-2712-4ad9-b278-6b0a96148cc1	88	t
1319	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	88	t
1320	6fc874f5-e524-4692-b482-6f15c5da413b	88	t
1321	05713b51-d123-4e90-933f-900940b4f82d	89	t
1322	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	89	t
1323	5050a3e0-947b-4319-be05-15ac1d8c9def	89	t
1324	5f5d1793-a7f4-438b-8344-06973689b35b	89	t
1325	399ef9d7-e57a-497f-850f-4203986eb932	89	t
1326	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	89	t
1327	1fa3666d-771f-485f-ad36-69868c23d624	89	t
1328	8039d3d3-260f-452a-a8c6-f59f427853b2	89	t
1329	f0187098-7164-4557-a514-e4f12cab7b29	89	t
1330	422bc56c-3368-415c-b822-5a701c607409	89	t
1331	e1653523-be47-48cc-a3c0-d664104bfd4b	89	t
1332	73a3a82e-468b-4665-92ae-5e9d5d0d432b	89	t
1333	91778966-2712-4ad9-b278-6b0a96148cc1	89	t
1334	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	89	t
1335	6fc874f5-e524-4692-b482-6f15c5da413b	89	t
1336	05713b51-d123-4e90-933f-900940b4f82d	90	t
1337	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	90	t
1338	5050a3e0-947b-4319-be05-15ac1d8c9def	90	t
1339	5f5d1793-a7f4-438b-8344-06973689b35b	90	t
1340	399ef9d7-e57a-497f-850f-4203986eb932	90	t
1341	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	90	t
1342	1fa3666d-771f-485f-ad36-69868c23d624	90	t
1343	8039d3d3-260f-452a-a8c6-f59f427853b2	90	t
1344	f0187098-7164-4557-a514-e4f12cab7b29	90	t
1345	422bc56c-3368-415c-b822-5a701c607409	90	t
1346	e1653523-be47-48cc-a3c0-d664104bfd4b	90	t
1347	73a3a82e-468b-4665-92ae-5e9d5d0d432b	90	t
1348	91778966-2712-4ad9-b278-6b0a96148cc1	90	t
1349	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	90	t
1350	6fc874f5-e524-4692-b482-6f15c5da413b	90	t
1351	05713b51-d123-4e90-933f-900940b4f82d	91	t
1352	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	91	t
1353	5050a3e0-947b-4319-be05-15ac1d8c9def	91	t
1354	5f5d1793-a7f4-438b-8344-06973689b35b	91	t
1355	399ef9d7-e57a-497f-850f-4203986eb932	91	t
1356	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	91	t
1357	1fa3666d-771f-485f-ad36-69868c23d624	91	t
1358	8039d3d3-260f-452a-a8c6-f59f427853b2	91	t
1359	f0187098-7164-4557-a514-e4f12cab7b29	91	t
1360	422bc56c-3368-415c-b822-5a701c607409	91	t
1361	e1653523-be47-48cc-a3c0-d664104bfd4b	91	t
1362	73a3a82e-468b-4665-92ae-5e9d5d0d432b	91	t
1363	91778966-2712-4ad9-b278-6b0a96148cc1	91	t
1364	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	91	t
1365	6fc874f5-e524-4692-b482-6f15c5da413b	91	t
1366	05713b51-d123-4e90-933f-900940b4f82d	92	t
1367	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	92	t
1368	5050a3e0-947b-4319-be05-15ac1d8c9def	92	t
1369	5f5d1793-a7f4-438b-8344-06973689b35b	92	t
1370	399ef9d7-e57a-497f-850f-4203986eb932	92	t
1371	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	92	t
1372	1fa3666d-771f-485f-ad36-69868c23d624	92	t
1373	8039d3d3-260f-452a-a8c6-f59f427853b2	92	t
1374	f0187098-7164-4557-a514-e4f12cab7b29	92	t
1375	422bc56c-3368-415c-b822-5a701c607409	92	t
1376	e1653523-be47-48cc-a3c0-d664104bfd4b	92	t
1377	73a3a82e-468b-4665-92ae-5e9d5d0d432b	92	t
1378	91778966-2712-4ad9-b278-6b0a96148cc1	92	t
1379	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	92	t
1380	6fc874f5-e524-4692-b482-6f15c5da413b	92	t
1381	05713b51-d123-4e90-933f-900940b4f82d	93	t
1382	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	93	t
1383	5050a3e0-947b-4319-be05-15ac1d8c9def	93	t
1384	5f5d1793-a7f4-438b-8344-06973689b35b	93	t
1385	399ef9d7-e57a-497f-850f-4203986eb932	93	t
1386	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	93	t
1387	1fa3666d-771f-485f-ad36-69868c23d624	93	t
1388	8039d3d3-260f-452a-a8c6-f59f427853b2	93	t
1389	f0187098-7164-4557-a514-e4f12cab7b29	93	t
1390	422bc56c-3368-415c-b822-5a701c607409	93	t
1391	e1653523-be47-48cc-a3c0-d664104bfd4b	93	t
1392	73a3a82e-468b-4665-92ae-5e9d5d0d432b	93	t
1393	91778966-2712-4ad9-b278-6b0a96148cc1	93	t
1394	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	93	t
1395	6fc874f5-e524-4692-b482-6f15c5da413b	93	t
1396	05713b51-d123-4e90-933f-900940b4f82d	94	t
1397	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	94	t
1398	5050a3e0-947b-4319-be05-15ac1d8c9def	94	t
1399	5f5d1793-a7f4-438b-8344-06973689b35b	94	t
1400	399ef9d7-e57a-497f-850f-4203986eb932	94	t
1401	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	94	t
1402	1fa3666d-771f-485f-ad36-69868c23d624	94	t
1403	8039d3d3-260f-452a-a8c6-f59f427853b2	94	t
1404	f0187098-7164-4557-a514-e4f12cab7b29	94	t
1405	422bc56c-3368-415c-b822-5a701c607409	94	t
1406	e1653523-be47-48cc-a3c0-d664104bfd4b	94	t
1407	73a3a82e-468b-4665-92ae-5e9d5d0d432b	94	t
1408	91778966-2712-4ad9-b278-6b0a96148cc1	94	t
1409	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	94	t
1410	6fc874f5-e524-4692-b482-6f15c5da413b	94	t
1411	05713b51-d123-4e90-933f-900940b4f82d	95	t
1412	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	95	t
1413	5050a3e0-947b-4319-be05-15ac1d8c9def	95	t
1414	5f5d1793-a7f4-438b-8344-06973689b35b	95	t
1415	399ef9d7-e57a-497f-850f-4203986eb932	95	t
1416	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	95	t
1417	1fa3666d-771f-485f-ad36-69868c23d624	95	t
1418	8039d3d3-260f-452a-a8c6-f59f427853b2	95	t
1419	f0187098-7164-4557-a514-e4f12cab7b29	95	t
1420	422bc56c-3368-415c-b822-5a701c607409	95	t
1421	e1653523-be47-48cc-a3c0-d664104bfd4b	95	t
1422	73a3a82e-468b-4665-92ae-5e9d5d0d432b	95	t
1423	91778966-2712-4ad9-b278-6b0a96148cc1	95	t
1424	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	95	t
1425	6fc874f5-e524-4692-b482-6f15c5da413b	95	t
1426	05713b51-d123-4e90-933f-900940b4f82d	96	t
1427	5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	96	t
1428	5050a3e0-947b-4319-be05-15ac1d8c9def	96	t
1429	5f5d1793-a7f4-438b-8344-06973689b35b	96	t
1430	399ef9d7-e57a-497f-850f-4203986eb932	96	t
1431	fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	96	t
1432	1fa3666d-771f-485f-ad36-69868c23d624	96	t
1433	8039d3d3-260f-452a-a8c6-f59f427853b2	96	t
1434	f0187098-7164-4557-a514-e4f12cab7b29	96	t
1435	422bc56c-3368-415c-b822-5a701c607409	96	t
1436	e1653523-be47-48cc-a3c0-d664104bfd4b	96	t
1437	73a3a82e-468b-4665-92ae-5e9d5d0d432b	96	t
1438	91778966-2712-4ad9-b278-6b0a96148cc1	96	t
1439	0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	96	t
1440	6fc874f5-e524-4692-b482-6f15c5da413b	96	t
1441	0028f20a-ee47-46e8-b080-6c8d8ef20757	97	t
1442	814dde62-62f3-4869-9eae-126780cd0dd1	97	t
1443	5bcebe27-9064-49d2-bf8e-7d8086115367	97	t
1444	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	97	t
1445	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	97	t
1446	3fccd7be-eba3-46e0-8d63-0d3345bce933	97	t
1447	59ead2c9-8ba1-4b96-a661-07cfc76834d7	97	t
1448	9b67a16a-bf32-4398-8245-f971515c653d	97	t
1449	4b6b480c-bfad-4300-944c-995a1f83e153	97	t
1450	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	97	t
1451	019526ba-c2c2-4047-9afa-1730fb310179	97	t
1452	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	97	t
1453	117aa301-dacd-4478-a109-75367a341c6e	97	t
1454	347762d1-9ad3-49c9-a3e6-e23a4acb543f	97	t
1455	4a1009e0-5c97-43f8-855a-cf76127c497e	97	t
1456	0028f20a-ee47-46e8-b080-6c8d8ef20757	98	t
1457	814dde62-62f3-4869-9eae-126780cd0dd1	98	t
1458	5bcebe27-9064-49d2-bf8e-7d8086115367	98	t
1459	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	98	t
1460	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	98	t
1461	3fccd7be-eba3-46e0-8d63-0d3345bce933	98	t
1462	59ead2c9-8ba1-4b96-a661-07cfc76834d7	98	t
1463	9b67a16a-bf32-4398-8245-f971515c653d	98	t
1464	4b6b480c-bfad-4300-944c-995a1f83e153	98	t
1465	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	98	t
1466	019526ba-c2c2-4047-9afa-1730fb310179	98	t
1467	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	98	t
1468	117aa301-dacd-4478-a109-75367a341c6e	98	t
1469	347762d1-9ad3-49c9-a3e6-e23a4acb543f	98	t
1470	4a1009e0-5c97-43f8-855a-cf76127c497e	98	t
1471	0028f20a-ee47-46e8-b080-6c8d8ef20757	99	t
1472	814dde62-62f3-4869-9eae-126780cd0dd1	99	t
1473	5bcebe27-9064-49d2-bf8e-7d8086115367	99	t
1474	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	99	t
1475	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	99	t
1476	3fccd7be-eba3-46e0-8d63-0d3345bce933	99	t
1477	59ead2c9-8ba1-4b96-a661-07cfc76834d7	99	t
1478	9b67a16a-bf32-4398-8245-f971515c653d	99	t
1479	4b6b480c-bfad-4300-944c-995a1f83e153	99	t
1480	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	99	t
1481	019526ba-c2c2-4047-9afa-1730fb310179	99	t
1482	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	99	t
1483	117aa301-dacd-4478-a109-75367a341c6e	99	t
1484	347762d1-9ad3-49c9-a3e6-e23a4acb543f	99	t
1485	4a1009e0-5c97-43f8-855a-cf76127c497e	99	t
1486	0028f20a-ee47-46e8-b080-6c8d8ef20757	100	t
1487	814dde62-62f3-4869-9eae-126780cd0dd1	100	t
1488	5bcebe27-9064-49d2-bf8e-7d8086115367	100	t
1489	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	100	t
1490	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	100	t
1491	3fccd7be-eba3-46e0-8d63-0d3345bce933	100	t
1492	59ead2c9-8ba1-4b96-a661-07cfc76834d7	100	t
1493	9b67a16a-bf32-4398-8245-f971515c653d	100	t
1494	4b6b480c-bfad-4300-944c-995a1f83e153	100	t
1495	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	100	t
1496	019526ba-c2c2-4047-9afa-1730fb310179	100	t
1497	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	100	t
1498	117aa301-dacd-4478-a109-75367a341c6e	100	t
1499	347762d1-9ad3-49c9-a3e6-e23a4acb543f	100	t
1500	4a1009e0-5c97-43f8-855a-cf76127c497e	100	t
1501	0028f20a-ee47-46e8-b080-6c8d8ef20757	101	t
1502	814dde62-62f3-4869-9eae-126780cd0dd1	101	t
1503	5bcebe27-9064-49d2-bf8e-7d8086115367	101	t
1504	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	101	t
1505	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	101	t
1506	3fccd7be-eba3-46e0-8d63-0d3345bce933	101	t
1507	59ead2c9-8ba1-4b96-a661-07cfc76834d7	101	t
1508	9b67a16a-bf32-4398-8245-f971515c653d	101	t
1509	4b6b480c-bfad-4300-944c-995a1f83e153	101	t
1510	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	101	t
1511	019526ba-c2c2-4047-9afa-1730fb310179	101	t
1512	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	101	t
1513	117aa301-dacd-4478-a109-75367a341c6e	101	t
1514	347762d1-9ad3-49c9-a3e6-e23a4acb543f	101	t
1515	4a1009e0-5c97-43f8-855a-cf76127c497e	101	t
1516	0028f20a-ee47-46e8-b080-6c8d8ef20757	102	t
1517	814dde62-62f3-4869-9eae-126780cd0dd1	102	t
1518	5bcebe27-9064-49d2-bf8e-7d8086115367	102	t
1519	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	102	t
1520	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	102	t
1521	3fccd7be-eba3-46e0-8d63-0d3345bce933	102	t
1522	59ead2c9-8ba1-4b96-a661-07cfc76834d7	102	t
1523	9b67a16a-bf32-4398-8245-f971515c653d	102	t
1524	4b6b480c-bfad-4300-944c-995a1f83e153	102	t
1525	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	102	t
1526	019526ba-c2c2-4047-9afa-1730fb310179	102	t
1527	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	102	t
1528	117aa301-dacd-4478-a109-75367a341c6e	102	t
1529	347762d1-9ad3-49c9-a3e6-e23a4acb543f	102	t
1530	4a1009e0-5c97-43f8-855a-cf76127c497e	102	t
1531	0028f20a-ee47-46e8-b080-6c8d8ef20757	103	t
1532	814dde62-62f3-4869-9eae-126780cd0dd1	103	t
1533	5bcebe27-9064-49d2-bf8e-7d8086115367	103	t
1534	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	103	t
1535	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	103	t
1536	3fccd7be-eba3-46e0-8d63-0d3345bce933	103	t
1537	59ead2c9-8ba1-4b96-a661-07cfc76834d7	103	t
1538	9b67a16a-bf32-4398-8245-f971515c653d	103	t
1539	4b6b480c-bfad-4300-944c-995a1f83e153	103	t
1540	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	103	t
1541	019526ba-c2c2-4047-9afa-1730fb310179	103	t
1542	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	103	t
1543	117aa301-dacd-4478-a109-75367a341c6e	103	t
1544	347762d1-9ad3-49c9-a3e6-e23a4acb543f	103	t
1545	4a1009e0-5c97-43f8-855a-cf76127c497e	103	t
1546	0028f20a-ee47-46e8-b080-6c8d8ef20757	104	t
1547	814dde62-62f3-4869-9eae-126780cd0dd1	104	t
1548	5bcebe27-9064-49d2-bf8e-7d8086115367	104	t
1549	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	104	t
1550	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	104	t
1551	3fccd7be-eba3-46e0-8d63-0d3345bce933	104	t
1552	59ead2c9-8ba1-4b96-a661-07cfc76834d7	104	t
1553	9b67a16a-bf32-4398-8245-f971515c653d	104	t
1554	4b6b480c-bfad-4300-944c-995a1f83e153	104	t
1555	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	104	t
1556	019526ba-c2c2-4047-9afa-1730fb310179	104	t
1557	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	104	t
1558	117aa301-dacd-4478-a109-75367a341c6e	104	t
1559	347762d1-9ad3-49c9-a3e6-e23a4acb543f	104	t
1560	4a1009e0-5c97-43f8-855a-cf76127c497e	104	t
1561	0028f20a-ee47-46e8-b080-6c8d8ef20757	105	t
1562	814dde62-62f3-4869-9eae-126780cd0dd1	105	t
1563	5bcebe27-9064-49d2-bf8e-7d8086115367	105	t
1564	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	105	t
1565	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	105	t
1566	3fccd7be-eba3-46e0-8d63-0d3345bce933	105	t
1567	59ead2c9-8ba1-4b96-a661-07cfc76834d7	105	t
1568	9b67a16a-bf32-4398-8245-f971515c653d	105	t
1569	4b6b480c-bfad-4300-944c-995a1f83e153	105	t
1570	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	105	t
1571	019526ba-c2c2-4047-9afa-1730fb310179	105	t
1572	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	105	t
1573	117aa301-dacd-4478-a109-75367a341c6e	105	t
1574	347762d1-9ad3-49c9-a3e6-e23a4acb543f	105	t
1575	4a1009e0-5c97-43f8-855a-cf76127c497e	105	t
1576	0028f20a-ee47-46e8-b080-6c8d8ef20757	106	t
1577	814dde62-62f3-4869-9eae-126780cd0dd1	106	t
1578	5bcebe27-9064-49d2-bf8e-7d8086115367	106	t
1579	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	106	t
1580	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	106	t
1581	3fccd7be-eba3-46e0-8d63-0d3345bce933	106	t
1582	59ead2c9-8ba1-4b96-a661-07cfc76834d7	106	t
1583	9b67a16a-bf32-4398-8245-f971515c653d	106	t
1584	4b6b480c-bfad-4300-944c-995a1f83e153	106	t
1585	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	106	t
1586	019526ba-c2c2-4047-9afa-1730fb310179	106	t
1587	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	106	t
1588	117aa301-dacd-4478-a109-75367a341c6e	106	t
1589	347762d1-9ad3-49c9-a3e6-e23a4acb543f	106	t
1590	4a1009e0-5c97-43f8-855a-cf76127c497e	106	t
1591	0028f20a-ee47-46e8-b080-6c8d8ef20757	107	t
1592	814dde62-62f3-4869-9eae-126780cd0dd1	107	t
1593	5bcebe27-9064-49d2-bf8e-7d8086115367	107	t
1594	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	107	t
1595	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	107	t
1596	3fccd7be-eba3-46e0-8d63-0d3345bce933	107	t
1597	59ead2c9-8ba1-4b96-a661-07cfc76834d7	107	t
1598	9b67a16a-bf32-4398-8245-f971515c653d	107	t
1599	4b6b480c-bfad-4300-944c-995a1f83e153	107	t
1600	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	107	t
1601	019526ba-c2c2-4047-9afa-1730fb310179	107	t
1602	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	107	t
1603	117aa301-dacd-4478-a109-75367a341c6e	107	t
1604	347762d1-9ad3-49c9-a3e6-e23a4acb543f	107	t
1605	4a1009e0-5c97-43f8-855a-cf76127c497e	107	t
1606	0028f20a-ee47-46e8-b080-6c8d8ef20757	108	t
1607	814dde62-62f3-4869-9eae-126780cd0dd1	108	t
1608	5bcebe27-9064-49d2-bf8e-7d8086115367	108	t
1609	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	108	t
1610	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	108	t
1611	3fccd7be-eba3-46e0-8d63-0d3345bce933	108	t
1612	59ead2c9-8ba1-4b96-a661-07cfc76834d7	108	t
1613	9b67a16a-bf32-4398-8245-f971515c653d	108	t
1614	4b6b480c-bfad-4300-944c-995a1f83e153	108	t
1615	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	108	t
1616	019526ba-c2c2-4047-9afa-1730fb310179	108	t
1617	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	108	t
1618	117aa301-dacd-4478-a109-75367a341c6e	108	t
1619	347762d1-9ad3-49c9-a3e6-e23a4acb543f	108	t
1620	4a1009e0-5c97-43f8-855a-cf76127c497e	108	t
1621	0028f20a-ee47-46e8-b080-6c8d8ef20757	109	t
1622	814dde62-62f3-4869-9eae-126780cd0dd1	109	t
1623	5bcebe27-9064-49d2-bf8e-7d8086115367	109	t
1624	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	109	t
1625	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	109	t
1626	3fccd7be-eba3-46e0-8d63-0d3345bce933	109	t
1627	59ead2c9-8ba1-4b96-a661-07cfc76834d7	109	t
1628	9b67a16a-bf32-4398-8245-f971515c653d	109	t
1629	4b6b480c-bfad-4300-944c-995a1f83e153	109	t
1630	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	109	t
1631	019526ba-c2c2-4047-9afa-1730fb310179	109	t
1632	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	109	t
1633	117aa301-dacd-4478-a109-75367a341c6e	109	t
1634	347762d1-9ad3-49c9-a3e6-e23a4acb543f	109	t
1635	4a1009e0-5c97-43f8-855a-cf76127c497e	109	t
1636	0028f20a-ee47-46e8-b080-6c8d8ef20757	110	t
1637	814dde62-62f3-4869-9eae-126780cd0dd1	110	t
1638	5bcebe27-9064-49d2-bf8e-7d8086115367	110	t
1639	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	110	t
1640	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	110	t
1641	3fccd7be-eba3-46e0-8d63-0d3345bce933	110	t
1642	59ead2c9-8ba1-4b96-a661-07cfc76834d7	110	t
1643	9b67a16a-bf32-4398-8245-f971515c653d	110	t
1644	4b6b480c-bfad-4300-944c-995a1f83e153	110	t
1645	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	110	t
1646	019526ba-c2c2-4047-9afa-1730fb310179	110	t
1647	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	110	t
1648	117aa301-dacd-4478-a109-75367a341c6e	110	t
1649	347762d1-9ad3-49c9-a3e6-e23a4acb543f	110	t
1650	4a1009e0-5c97-43f8-855a-cf76127c497e	110	t
1651	0028f20a-ee47-46e8-b080-6c8d8ef20757	111	t
1652	814dde62-62f3-4869-9eae-126780cd0dd1	111	t
1653	5bcebe27-9064-49d2-bf8e-7d8086115367	111	t
1654	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	111	t
1655	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	111	t
1656	3fccd7be-eba3-46e0-8d63-0d3345bce933	111	t
1657	59ead2c9-8ba1-4b96-a661-07cfc76834d7	111	t
1658	9b67a16a-bf32-4398-8245-f971515c653d	111	t
1659	4b6b480c-bfad-4300-944c-995a1f83e153	111	t
1660	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	111	t
1661	019526ba-c2c2-4047-9afa-1730fb310179	111	t
1662	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	111	t
1663	117aa301-dacd-4478-a109-75367a341c6e	111	t
1664	347762d1-9ad3-49c9-a3e6-e23a4acb543f	111	t
1665	4a1009e0-5c97-43f8-855a-cf76127c497e	111	t
1666	0028f20a-ee47-46e8-b080-6c8d8ef20757	112	t
1667	814dde62-62f3-4869-9eae-126780cd0dd1	112	t
1668	5bcebe27-9064-49d2-bf8e-7d8086115367	112	t
1669	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	112	t
1670	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	112	t
1671	3fccd7be-eba3-46e0-8d63-0d3345bce933	112	t
1672	59ead2c9-8ba1-4b96-a661-07cfc76834d7	112	t
1673	9b67a16a-bf32-4398-8245-f971515c653d	112	t
1674	4b6b480c-bfad-4300-944c-995a1f83e153	112	t
1675	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	112	t
1676	019526ba-c2c2-4047-9afa-1730fb310179	112	t
1677	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	112	t
1678	117aa301-dacd-4478-a109-75367a341c6e	112	t
1679	347762d1-9ad3-49c9-a3e6-e23a4acb543f	112	t
1680	4a1009e0-5c97-43f8-855a-cf76127c497e	112	t
1681	0028f20a-ee47-46e8-b080-6c8d8ef20757	113	t
1682	814dde62-62f3-4869-9eae-126780cd0dd1	113	t
1683	5bcebe27-9064-49d2-bf8e-7d8086115367	113	t
1684	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	113	t
1685	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	113	t
1686	3fccd7be-eba3-46e0-8d63-0d3345bce933	113	t
1687	59ead2c9-8ba1-4b96-a661-07cfc76834d7	113	t
1688	9b67a16a-bf32-4398-8245-f971515c653d	113	t
1689	4b6b480c-bfad-4300-944c-995a1f83e153	113	t
1690	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	113	t
1691	019526ba-c2c2-4047-9afa-1730fb310179	113	t
1692	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	113	t
1693	117aa301-dacd-4478-a109-75367a341c6e	113	t
1694	347762d1-9ad3-49c9-a3e6-e23a4acb543f	113	t
1695	4a1009e0-5c97-43f8-855a-cf76127c497e	113	t
1696	0028f20a-ee47-46e8-b080-6c8d8ef20757	114	t
1697	814dde62-62f3-4869-9eae-126780cd0dd1	114	t
1698	5bcebe27-9064-49d2-bf8e-7d8086115367	114	t
1699	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	114	t
1700	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	114	t
1701	3fccd7be-eba3-46e0-8d63-0d3345bce933	114	t
1702	59ead2c9-8ba1-4b96-a661-07cfc76834d7	114	t
1703	9b67a16a-bf32-4398-8245-f971515c653d	114	t
1704	4b6b480c-bfad-4300-944c-995a1f83e153	114	t
1705	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	114	t
1706	019526ba-c2c2-4047-9afa-1730fb310179	114	t
1707	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	114	t
1708	117aa301-dacd-4478-a109-75367a341c6e	114	t
1709	347762d1-9ad3-49c9-a3e6-e23a4acb543f	114	t
1710	4a1009e0-5c97-43f8-855a-cf76127c497e	114	t
1711	0028f20a-ee47-46e8-b080-6c8d8ef20757	115	t
1712	814dde62-62f3-4869-9eae-126780cd0dd1	115	t
1713	5bcebe27-9064-49d2-bf8e-7d8086115367	115	t
1714	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	115	t
1715	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	115	t
1716	3fccd7be-eba3-46e0-8d63-0d3345bce933	115	t
1717	59ead2c9-8ba1-4b96-a661-07cfc76834d7	115	t
1718	9b67a16a-bf32-4398-8245-f971515c653d	115	t
1719	4b6b480c-bfad-4300-944c-995a1f83e153	115	t
1720	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	115	t
1721	019526ba-c2c2-4047-9afa-1730fb310179	115	t
1722	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	115	t
1723	117aa301-dacd-4478-a109-75367a341c6e	115	t
1724	347762d1-9ad3-49c9-a3e6-e23a4acb543f	115	t
1725	4a1009e0-5c97-43f8-855a-cf76127c497e	115	t
1726	0028f20a-ee47-46e8-b080-6c8d8ef20757	116	t
1727	814dde62-62f3-4869-9eae-126780cd0dd1	116	t
1728	5bcebe27-9064-49d2-bf8e-7d8086115367	116	t
1729	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	116	t
1730	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	116	t
1731	3fccd7be-eba3-46e0-8d63-0d3345bce933	116	t
1732	59ead2c9-8ba1-4b96-a661-07cfc76834d7	116	t
1733	9b67a16a-bf32-4398-8245-f971515c653d	116	t
1734	4b6b480c-bfad-4300-944c-995a1f83e153	116	t
1735	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	116	t
1736	019526ba-c2c2-4047-9afa-1730fb310179	116	t
1737	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	116	t
1738	117aa301-dacd-4478-a109-75367a341c6e	116	t
1739	347762d1-9ad3-49c9-a3e6-e23a4acb543f	116	t
1740	4a1009e0-5c97-43f8-855a-cf76127c497e	116	t
1741	0028f20a-ee47-46e8-b080-6c8d8ef20757	117	t
1742	814dde62-62f3-4869-9eae-126780cd0dd1	117	t
1743	5bcebe27-9064-49d2-bf8e-7d8086115367	117	t
1744	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	117	t
1745	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	117	t
1746	3fccd7be-eba3-46e0-8d63-0d3345bce933	117	t
1747	59ead2c9-8ba1-4b96-a661-07cfc76834d7	117	t
1748	9b67a16a-bf32-4398-8245-f971515c653d	117	t
1749	4b6b480c-bfad-4300-944c-995a1f83e153	117	t
1750	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	117	t
1751	019526ba-c2c2-4047-9afa-1730fb310179	117	t
1752	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	117	t
1753	117aa301-dacd-4478-a109-75367a341c6e	117	t
1754	347762d1-9ad3-49c9-a3e6-e23a4acb543f	117	t
1755	4a1009e0-5c97-43f8-855a-cf76127c497e	117	t
1756	0028f20a-ee47-46e8-b080-6c8d8ef20757	118	t
1757	814dde62-62f3-4869-9eae-126780cd0dd1	118	t
1758	5bcebe27-9064-49d2-bf8e-7d8086115367	118	t
1759	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	118	t
1760	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	118	t
1761	3fccd7be-eba3-46e0-8d63-0d3345bce933	118	t
1762	59ead2c9-8ba1-4b96-a661-07cfc76834d7	118	t
1763	9b67a16a-bf32-4398-8245-f971515c653d	118	t
1764	4b6b480c-bfad-4300-944c-995a1f83e153	118	t
1765	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	118	t
1766	019526ba-c2c2-4047-9afa-1730fb310179	118	t
1767	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	118	t
1768	117aa301-dacd-4478-a109-75367a341c6e	118	t
1769	347762d1-9ad3-49c9-a3e6-e23a4acb543f	118	t
1770	4a1009e0-5c97-43f8-855a-cf76127c497e	118	t
1771	0028f20a-ee47-46e8-b080-6c8d8ef20757	119	t
1772	814dde62-62f3-4869-9eae-126780cd0dd1	119	t
1773	5bcebe27-9064-49d2-bf8e-7d8086115367	119	t
1774	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	119	t
1775	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	119	t
1776	3fccd7be-eba3-46e0-8d63-0d3345bce933	119	t
1777	59ead2c9-8ba1-4b96-a661-07cfc76834d7	119	t
1778	9b67a16a-bf32-4398-8245-f971515c653d	119	t
1779	4b6b480c-bfad-4300-944c-995a1f83e153	119	t
1780	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	119	t
1781	019526ba-c2c2-4047-9afa-1730fb310179	119	t
1782	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	119	t
1783	117aa301-dacd-4478-a109-75367a341c6e	119	t
1784	347762d1-9ad3-49c9-a3e6-e23a4acb543f	119	t
1785	4a1009e0-5c97-43f8-855a-cf76127c497e	119	t
1786	0028f20a-ee47-46e8-b080-6c8d8ef20757	120	t
1787	814dde62-62f3-4869-9eae-126780cd0dd1	120	t
1788	5bcebe27-9064-49d2-bf8e-7d8086115367	120	t
1789	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	120	t
1790	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	120	t
1791	3fccd7be-eba3-46e0-8d63-0d3345bce933	120	t
1792	59ead2c9-8ba1-4b96-a661-07cfc76834d7	120	t
1793	9b67a16a-bf32-4398-8245-f971515c653d	120	t
1794	4b6b480c-bfad-4300-944c-995a1f83e153	120	t
1795	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	120	t
1796	019526ba-c2c2-4047-9afa-1730fb310179	120	t
1797	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	120	t
1798	117aa301-dacd-4478-a109-75367a341c6e	120	t
1799	347762d1-9ad3-49c9-a3e6-e23a4acb543f	120	t
1800	4a1009e0-5c97-43f8-855a-cf76127c497e	120	t
1801	0028f20a-ee47-46e8-b080-6c8d8ef20757	121	t
1802	814dde62-62f3-4869-9eae-126780cd0dd1	121	t
1803	5bcebe27-9064-49d2-bf8e-7d8086115367	121	t
1804	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	121	t
1805	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	121	t
1806	3fccd7be-eba3-46e0-8d63-0d3345bce933	121	t
1807	59ead2c9-8ba1-4b96-a661-07cfc76834d7	121	t
1808	9b67a16a-bf32-4398-8245-f971515c653d	121	t
1809	4b6b480c-bfad-4300-944c-995a1f83e153	121	t
1810	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	121	t
1811	019526ba-c2c2-4047-9afa-1730fb310179	121	t
1812	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	121	t
1813	117aa301-dacd-4478-a109-75367a341c6e	121	t
1814	347762d1-9ad3-49c9-a3e6-e23a4acb543f	121	t
1815	4a1009e0-5c97-43f8-855a-cf76127c497e	121	t
1816	0028f20a-ee47-46e8-b080-6c8d8ef20757	122	t
1817	814dde62-62f3-4869-9eae-126780cd0dd1	122	t
1818	5bcebe27-9064-49d2-bf8e-7d8086115367	122	t
1819	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	122	t
1820	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	122	t
1821	3fccd7be-eba3-46e0-8d63-0d3345bce933	122	t
1822	59ead2c9-8ba1-4b96-a661-07cfc76834d7	122	t
1823	9b67a16a-bf32-4398-8245-f971515c653d	122	t
1824	4b6b480c-bfad-4300-944c-995a1f83e153	122	t
1825	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	122	t
1826	019526ba-c2c2-4047-9afa-1730fb310179	122	t
1827	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	122	t
1828	117aa301-dacd-4478-a109-75367a341c6e	122	t
1829	347762d1-9ad3-49c9-a3e6-e23a4acb543f	122	t
1830	4a1009e0-5c97-43f8-855a-cf76127c497e	122	t
1831	0028f20a-ee47-46e8-b080-6c8d8ef20757	123	t
1832	814dde62-62f3-4869-9eae-126780cd0dd1	123	t
1833	5bcebe27-9064-49d2-bf8e-7d8086115367	123	t
1834	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	123	t
1835	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	123	t
1836	3fccd7be-eba3-46e0-8d63-0d3345bce933	123	t
1837	59ead2c9-8ba1-4b96-a661-07cfc76834d7	123	t
1838	9b67a16a-bf32-4398-8245-f971515c653d	123	t
1839	4b6b480c-bfad-4300-944c-995a1f83e153	123	t
1840	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	123	t
1841	019526ba-c2c2-4047-9afa-1730fb310179	123	t
1842	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	123	t
1843	117aa301-dacd-4478-a109-75367a341c6e	123	t
1844	347762d1-9ad3-49c9-a3e6-e23a4acb543f	123	t
1845	4a1009e0-5c97-43f8-855a-cf76127c497e	123	t
1846	0028f20a-ee47-46e8-b080-6c8d8ef20757	124	t
1847	814dde62-62f3-4869-9eae-126780cd0dd1	124	t
1848	5bcebe27-9064-49d2-bf8e-7d8086115367	124	t
1849	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	124	t
1850	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	124	t
1851	3fccd7be-eba3-46e0-8d63-0d3345bce933	124	t
1852	59ead2c9-8ba1-4b96-a661-07cfc76834d7	124	t
1853	9b67a16a-bf32-4398-8245-f971515c653d	124	t
1854	4b6b480c-bfad-4300-944c-995a1f83e153	124	t
1855	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	124	t
1856	019526ba-c2c2-4047-9afa-1730fb310179	124	t
1857	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	124	t
1858	117aa301-dacd-4478-a109-75367a341c6e	124	t
1859	347762d1-9ad3-49c9-a3e6-e23a4acb543f	124	t
1860	4a1009e0-5c97-43f8-855a-cf76127c497e	124	t
1861	0028f20a-ee47-46e8-b080-6c8d8ef20757	125	t
1862	814dde62-62f3-4869-9eae-126780cd0dd1	125	t
1863	5bcebe27-9064-49d2-bf8e-7d8086115367	125	t
1864	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	125	t
1865	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	125	t
1866	3fccd7be-eba3-46e0-8d63-0d3345bce933	125	t
1867	59ead2c9-8ba1-4b96-a661-07cfc76834d7	125	t
1868	9b67a16a-bf32-4398-8245-f971515c653d	125	t
1869	4b6b480c-bfad-4300-944c-995a1f83e153	125	t
1870	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	125	t
1871	019526ba-c2c2-4047-9afa-1730fb310179	125	t
1872	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	125	t
1873	117aa301-dacd-4478-a109-75367a341c6e	125	t
1874	347762d1-9ad3-49c9-a3e6-e23a4acb543f	125	t
1875	4a1009e0-5c97-43f8-855a-cf76127c497e	125	t
1876	0028f20a-ee47-46e8-b080-6c8d8ef20757	126	t
1877	814dde62-62f3-4869-9eae-126780cd0dd1	126	t
1878	5bcebe27-9064-49d2-bf8e-7d8086115367	126	t
1879	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	126	t
1880	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	126	t
1881	3fccd7be-eba3-46e0-8d63-0d3345bce933	126	t
1882	59ead2c9-8ba1-4b96-a661-07cfc76834d7	126	t
1883	9b67a16a-bf32-4398-8245-f971515c653d	126	t
1884	4b6b480c-bfad-4300-944c-995a1f83e153	126	t
1885	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	126	t
1886	019526ba-c2c2-4047-9afa-1730fb310179	126	t
1887	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	126	t
1888	117aa301-dacd-4478-a109-75367a341c6e	126	t
1889	347762d1-9ad3-49c9-a3e6-e23a4acb543f	126	t
1890	4a1009e0-5c97-43f8-855a-cf76127c497e	126	t
1891	0028f20a-ee47-46e8-b080-6c8d8ef20757	127	t
1892	814dde62-62f3-4869-9eae-126780cd0dd1	127	t
1893	5bcebe27-9064-49d2-bf8e-7d8086115367	127	t
1894	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	127	t
1895	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	127	t
1896	3fccd7be-eba3-46e0-8d63-0d3345bce933	127	t
1897	59ead2c9-8ba1-4b96-a661-07cfc76834d7	127	t
1898	9b67a16a-bf32-4398-8245-f971515c653d	127	t
1899	4b6b480c-bfad-4300-944c-995a1f83e153	127	t
1900	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	127	t
1901	019526ba-c2c2-4047-9afa-1730fb310179	127	t
1902	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	127	t
1903	117aa301-dacd-4478-a109-75367a341c6e	127	t
1904	347762d1-9ad3-49c9-a3e6-e23a4acb543f	127	t
1905	4a1009e0-5c97-43f8-855a-cf76127c497e	127	t
1906	0028f20a-ee47-46e8-b080-6c8d8ef20757	128	t
1907	814dde62-62f3-4869-9eae-126780cd0dd1	128	t
1908	5bcebe27-9064-49d2-bf8e-7d8086115367	128	t
1909	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	128	t
1910	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	128	t
1911	3fccd7be-eba3-46e0-8d63-0d3345bce933	128	t
1912	59ead2c9-8ba1-4b96-a661-07cfc76834d7	128	t
1913	9b67a16a-bf32-4398-8245-f971515c653d	128	t
1914	4b6b480c-bfad-4300-944c-995a1f83e153	128	t
1915	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	128	t
1916	019526ba-c2c2-4047-9afa-1730fb310179	128	t
1917	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	128	t
1918	117aa301-dacd-4478-a109-75367a341c6e	128	t
1919	347762d1-9ad3-49c9-a3e6-e23a4acb543f	128	t
1920	4a1009e0-5c97-43f8-855a-cf76127c497e	128	t
1921	0028f20a-ee47-46e8-b080-6c8d8ef20757	129	t
1922	814dde62-62f3-4869-9eae-126780cd0dd1	129	t
1923	5bcebe27-9064-49d2-bf8e-7d8086115367	129	t
1924	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	129	t
1925	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	129	t
1926	3fccd7be-eba3-46e0-8d63-0d3345bce933	129	t
1927	59ead2c9-8ba1-4b96-a661-07cfc76834d7	129	t
1928	9b67a16a-bf32-4398-8245-f971515c653d	129	t
1929	4b6b480c-bfad-4300-944c-995a1f83e153	129	t
1930	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	129	t
1931	019526ba-c2c2-4047-9afa-1730fb310179	129	t
1932	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	129	t
1933	117aa301-dacd-4478-a109-75367a341c6e	129	t
1934	347762d1-9ad3-49c9-a3e6-e23a4acb543f	129	t
1935	4a1009e0-5c97-43f8-855a-cf76127c497e	129	t
1936	0028f20a-ee47-46e8-b080-6c8d8ef20757	130	t
1937	814dde62-62f3-4869-9eae-126780cd0dd1	130	t
1938	5bcebe27-9064-49d2-bf8e-7d8086115367	130	t
1939	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	130	t
1940	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	130	t
1941	3fccd7be-eba3-46e0-8d63-0d3345bce933	130	t
1942	59ead2c9-8ba1-4b96-a661-07cfc76834d7	130	t
1943	9b67a16a-bf32-4398-8245-f971515c653d	130	t
1944	4b6b480c-bfad-4300-944c-995a1f83e153	130	t
1945	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	130	t
1946	019526ba-c2c2-4047-9afa-1730fb310179	130	t
1947	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	130	t
1948	117aa301-dacd-4478-a109-75367a341c6e	130	t
1949	347762d1-9ad3-49c9-a3e6-e23a4acb543f	130	t
1950	4a1009e0-5c97-43f8-855a-cf76127c497e	130	t
1951	0028f20a-ee47-46e8-b080-6c8d8ef20757	131	t
1952	814dde62-62f3-4869-9eae-126780cd0dd1	131	t
1953	5bcebe27-9064-49d2-bf8e-7d8086115367	131	t
1954	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	131	t
1955	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	131	t
1956	3fccd7be-eba3-46e0-8d63-0d3345bce933	131	t
1957	59ead2c9-8ba1-4b96-a661-07cfc76834d7	131	t
1958	9b67a16a-bf32-4398-8245-f971515c653d	131	t
1959	4b6b480c-bfad-4300-944c-995a1f83e153	131	t
1960	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	131	t
1961	019526ba-c2c2-4047-9afa-1730fb310179	131	t
1962	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	131	t
1963	117aa301-dacd-4478-a109-75367a341c6e	131	t
1964	347762d1-9ad3-49c9-a3e6-e23a4acb543f	131	t
1965	4a1009e0-5c97-43f8-855a-cf76127c497e	131	t
1966	0028f20a-ee47-46e8-b080-6c8d8ef20757	132	t
1967	814dde62-62f3-4869-9eae-126780cd0dd1	132	t
1968	5bcebe27-9064-49d2-bf8e-7d8086115367	132	t
1969	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	132	t
1970	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	132	t
1971	3fccd7be-eba3-46e0-8d63-0d3345bce933	132	t
1972	59ead2c9-8ba1-4b96-a661-07cfc76834d7	132	t
1973	9b67a16a-bf32-4398-8245-f971515c653d	132	t
1974	4b6b480c-bfad-4300-944c-995a1f83e153	132	t
1975	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	132	t
1976	019526ba-c2c2-4047-9afa-1730fb310179	132	t
1977	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	132	t
1978	117aa301-dacd-4478-a109-75367a341c6e	132	t
1979	347762d1-9ad3-49c9-a3e6-e23a4acb543f	132	t
1980	4a1009e0-5c97-43f8-855a-cf76127c497e	132	t
1981	0028f20a-ee47-46e8-b080-6c8d8ef20757	133	t
1982	814dde62-62f3-4869-9eae-126780cd0dd1	133	t
1983	5bcebe27-9064-49d2-bf8e-7d8086115367	133	t
1984	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	133	t
1985	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	133	t
1986	3fccd7be-eba3-46e0-8d63-0d3345bce933	133	t
1987	59ead2c9-8ba1-4b96-a661-07cfc76834d7	133	t
1988	9b67a16a-bf32-4398-8245-f971515c653d	133	t
1989	4b6b480c-bfad-4300-944c-995a1f83e153	133	t
1990	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	133	t
1991	019526ba-c2c2-4047-9afa-1730fb310179	133	t
1992	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	133	t
1993	117aa301-dacd-4478-a109-75367a341c6e	133	t
1994	347762d1-9ad3-49c9-a3e6-e23a4acb543f	133	t
1995	4a1009e0-5c97-43f8-855a-cf76127c497e	133	t
1996	0028f20a-ee47-46e8-b080-6c8d8ef20757	134	t
1997	814dde62-62f3-4869-9eae-126780cd0dd1	134	t
1998	5bcebe27-9064-49d2-bf8e-7d8086115367	134	t
1999	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	134	t
2000	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	134	t
2001	3fccd7be-eba3-46e0-8d63-0d3345bce933	134	t
2002	59ead2c9-8ba1-4b96-a661-07cfc76834d7	134	t
2003	9b67a16a-bf32-4398-8245-f971515c653d	134	t
2004	4b6b480c-bfad-4300-944c-995a1f83e153	134	t
2005	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	134	t
2006	019526ba-c2c2-4047-9afa-1730fb310179	134	t
2007	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	134	t
2008	117aa301-dacd-4478-a109-75367a341c6e	134	t
2009	347762d1-9ad3-49c9-a3e6-e23a4acb543f	134	t
2010	4a1009e0-5c97-43f8-855a-cf76127c497e	134	t
2011	0028f20a-ee47-46e8-b080-6c8d8ef20757	135	t
2012	814dde62-62f3-4869-9eae-126780cd0dd1	135	t
2013	5bcebe27-9064-49d2-bf8e-7d8086115367	135	t
2014	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	135	t
2015	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	135	t
2016	3fccd7be-eba3-46e0-8d63-0d3345bce933	135	t
2017	59ead2c9-8ba1-4b96-a661-07cfc76834d7	135	t
2018	9b67a16a-bf32-4398-8245-f971515c653d	135	t
2019	4b6b480c-bfad-4300-944c-995a1f83e153	135	t
2020	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	135	t
2021	019526ba-c2c2-4047-9afa-1730fb310179	135	t
2022	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	135	t
2023	117aa301-dacd-4478-a109-75367a341c6e	135	t
2024	347762d1-9ad3-49c9-a3e6-e23a4acb543f	135	t
2025	4a1009e0-5c97-43f8-855a-cf76127c497e	135	t
2026	0028f20a-ee47-46e8-b080-6c8d8ef20757	136	t
2027	814dde62-62f3-4869-9eae-126780cd0dd1	136	t
2028	5bcebe27-9064-49d2-bf8e-7d8086115367	136	t
2029	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	136	t
2030	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	136	t
2031	3fccd7be-eba3-46e0-8d63-0d3345bce933	136	t
2032	59ead2c9-8ba1-4b96-a661-07cfc76834d7	136	t
2033	9b67a16a-bf32-4398-8245-f971515c653d	136	t
2034	4b6b480c-bfad-4300-944c-995a1f83e153	136	t
2035	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	136	t
2036	019526ba-c2c2-4047-9afa-1730fb310179	136	t
2037	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	136	t
2038	117aa301-dacd-4478-a109-75367a341c6e	136	t
2039	347762d1-9ad3-49c9-a3e6-e23a4acb543f	136	t
2040	4a1009e0-5c97-43f8-855a-cf76127c497e	136	t
2041	0028f20a-ee47-46e8-b080-6c8d8ef20757	137	t
2042	814dde62-62f3-4869-9eae-126780cd0dd1	137	t
2043	5bcebe27-9064-49d2-bf8e-7d8086115367	137	t
2044	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	137	t
2045	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	137	t
2046	3fccd7be-eba3-46e0-8d63-0d3345bce933	137	t
2047	59ead2c9-8ba1-4b96-a661-07cfc76834d7	137	t
2048	9b67a16a-bf32-4398-8245-f971515c653d	137	t
2049	4b6b480c-bfad-4300-944c-995a1f83e153	137	t
2050	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	137	t
2051	019526ba-c2c2-4047-9afa-1730fb310179	137	t
2052	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	137	t
2053	117aa301-dacd-4478-a109-75367a341c6e	137	t
2054	347762d1-9ad3-49c9-a3e6-e23a4acb543f	137	t
2055	4a1009e0-5c97-43f8-855a-cf76127c497e	137	t
2056	0028f20a-ee47-46e8-b080-6c8d8ef20757	138	t
2057	814dde62-62f3-4869-9eae-126780cd0dd1	138	t
2058	5bcebe27-9064-49d2-bf8e-7d8086115367	138	t
2059	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	138	t
2060	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	138	t
2061	3fccd7be-eba3-46e0-8d63-0d3345bce933	138	t
2062	59ead2c9-8ba1-4b96-a661-07cfc76834d7	138	t
2063	9b67a16a-bf32-4398-8245-f971515c653d	138	t
2064	4b6b480c-bfad-4300-944c-995a1f83e153	138	t
2065	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	138	t
2066	019526ba-c2c2-4047-9afa-1730fb310179	138	t
2067	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	138	t
2068	117aa301-dacd-4478-a109-75367a341c6e	138	t
2069	347762d1-9ad3-49c9-a3e6-e23a4acb543f	138	t
2070	4a1009e0-5c97-43f8-855a-cf76127c497e	138	t
2071	0028f20a-ee47-46e8-b080-6c8d8ef20757	139	t
2072	814dde62-62f3-4869-9eae-126780cd0dd1	139	t
2073	5bcebe27-9064-49d2-bf8e-7d8086115367	139	t
2074	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	139	t
2075	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	139	t
2076	3fccd7be-eba3-46e0-8d63-0d3345bce933	139	t
2077	59ead2c9-8ba1-4b96-a661-07cfc76834d7	139	t
2078	9b67a16a-bf32-4398-8245-f971515c653d	139	t
2079	4b6b480c-bfad-4300-944c-995a1f83e153	139	t
2080	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	139	t
2081	019526ba-c2c2-4047-9afa-1730fb310179	139	t
2082	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	139	t
2083	117aa301-dacd-4478-a109-75367a341c6e	139	t
2084	347762d1-9ad3-49c9-a3e6-e23a4acb543f	139	t
2085	4a1009e0-5c97-43f8-855a-cf76127c497e	139	t
2086	0028f20a-ee47-46e8-b080-6c8d8ef20757	140	t
2087	814dde62-62f3-4869-9eae-126780cd0dd1	140	t
2088	5bcebe27-9064-49d2-bf8e-7d8086115367	140	t
2089	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	140	t
2090	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	140	t
2091	3fccd7be-eba3-46e0-8d63-0d3345bce933	140	t
2092	59ead2c9-8ba1-4b96-a661-07cfc76834d7	140	t
2093	9b67a16a-bf32-4398-8245-f971515c653d	140	t
2094	4b6b480c-bfad-4300-944c-995a1f83e153	140	t
2095	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	140	t
2096	019526ba-c2c2-4047-9afa-1730fb310179	140	t
2097	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	140	t
2098	117aa301-dacd-4478-a109-75367a341c6e	140	t
2099	347762d1-9ad3-49c9-a3e6-e23a4acb543f	140	t
2100	4a1009e0-5c97-43f8-855a-cf76127c497e	140	t
2101	0028f20a-ee47-46e8-b080-6c8d8ef20757	141	t
2102	814dde62-62f3-4869-9eae-126780cd0dd1	141	t
2103	5bcebe27-9064-49d2-bf8e-7d8086115367	141	t
2104	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	141	t
2105	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	141	t
2106	3fccd7be-eba3-46e0-8d63-0d3345bce933	141	t
2107	59ead2c9-8ba1-4b96-a661-07cfc76834d7	141	t
2108	9b67a16a-bf32-4398-8245-f971515c653d	141	t
2109	4b6b480c-bfad-4300-944c-995a1f83e153	141	t
2110	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	141	t
2111	019526ba-c2c2-4047-9afa-1730fb310179	141	t
2112	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	141	t
2113	117aa301-dacd-4478-a109-75367a341c6e	141	t
2114	347762d1-9ad3-49c9-a3e6-e23a4acb543f	141	t
2115	4a1009e0-5c97-43f8-855a-cf76127c497e	141	t
2116	0028f20a-ee47-46e8-b080-6c8d8ef20757	142	t
2117	814dde62-62f3-4869-9eae-126780cd0dd1	142	t
2118	5bcebe27-9064-49d2-bf8e-7d8086115367	142	t
2119	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	142	t
2120	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	142	t
2121	3fccd7be-eba3-46e0-8d63-0d3345bce933	142	t
2122	59ead2c9-8ba1-4b96-a661-07cfc76834d7	142	t
2123	9b67a16a-bf32-4398-8245-f971515c653d	142	t
2124	4b6b480c-bfad-4300-944c-995a1f83e153	142	t
2125	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	142	t
2126	019526ba-c2c2-4047-9afa-1730fb310179	142	t
2127	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	142	t
2128	117aa301-dacd-4478-a109-75367a341c6e	142	t
2129	347762d1-9ad3-49c9-a3e6-e23a4acb543f	142	t
2130	4a1009e0-5c97-43f8-855a-cf76127c497e	142	t
2131	0028f20a-ee47-46e8-b080-6c8d8ef20757	143	t
2132	814dde62-62f3-4869-9eae-126780cd0dd1	143	t
2133	5bcebe27-9064-49d2-bf8e-7d8086115367	143	t
2134	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	143	t
2135	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	143	t
2136	3fccd7be-eba3-46e0-8d63-0d3345bce933	143	t
2137	59ead2c9-8ba1-4b96-a661-07cfc76834d7	143	t
2138	9b67a16a-bf32-4398-8245-f971515c653d	143	t
2139	4b6b480c-bfad-4300-944c-995a1f83e153	143	t
2140	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	143	t
2141	019526ba-c2c2-4047-9afa-1730fb310179	143	t
2142	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	143	t
2143	117aa301-dacd-4478-a109-75367a341c6e	143	t
2144	347762d1-9ad3-49c9-a3e6-e23a4acb543f	143	t
2145	4a1009e0-5c97-43f8-855a-cf76127c497e	143	t
2146	0028f20a-ee47-46e8-b080-6c8d8ef20757	144	t
2147	814dde62-62f3-4869-9eae-126780cd0dd1	144	t
2148	5bcebe27-9064-49d2-bf8e-7d8086115367	144	t
2149	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	144	t
2150	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	144	t
2151	3fccd7be-eba3-46e0-8d63-0d3345bce933	144	t
2152	59ead2c9-8ba1-4b96-a661-07cfc76834d7	144	t
2153	9b67a16a-bf32-4398-8245-f971515c653d	144	t
2154	4b6b480c-bfad-4300-944c-995a1f83e153	144	t
2155	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	144	t
2156	019526ba-c2c2-4047-9afa-1730fb310179	144	t
2157	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	144	t
2158	117aa301-dacd-4478-a109-75367a341c6e	144	t
2159	347762d1-9ad3-49c9-a3e6-e23a4acb543f	144	t
2160	4a1009e0-5c97-43f8-855a-cf76127c497e	144	t
2161	0028f20a-ee47-46e8-b080-6c8d8ef20757	145	t
2162	814dde62-62f3-4869-9eae-126780cd0dd1	145	t
2163	5bcebe27-9064-49d2-bf8e-7d8086115367	145	t
2164	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	145	t
2165	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	145	t
2166	3fccd7be-eba3-46e0-8d63-0d3345bce933	145	t
2167	59ead2c9-8ba1-4b96-a661-07cfc76834d7	145	t
2168	9b67a16a-bf32-4398-8245-f971515c653d	145	t
2169	4b6b480c-bfad-4300-944c-995a1f83e153	145	t
2170	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	145	t
2171	019526ba-c2c2-4047-9afa-1730fb310179	145	t
2172	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	145	t
2173	117aa301-dacd-4478-a109-75367a341c6e	145	t
2174	347762d1-9ad3-49c9-a3e6-e23a4acb543f	145	t
2175	4a1009e0-5c97-43f8-855a-cf76127c497e	145	t
2176	0028f20a-ee47-46e8-b080-6c8d8ef20757	146	t
2177	814dde62-62f3-4869-9eae-126780cd0dd1	146	t
2178	5bcebe27-9064-49d2-bf8e-7d8086115367	146	t
2179	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	146	t
2180	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	146	t
2181	3fccd7be-eba3-46e0-8d63-0d3345bce933	146	t
2182	59ead2c9-8ba1-4b96-a661-07cfc76834d7	146	t
2183	9b67a16a-bf32-4398-8245-f971515c653d	146	t
2184	4b6b480c-bfad-4300-944c-995a1f83e153	146	t
2185	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	146	t
2186	019526ba-c2c2-4047-9afa-1730fb310179	146	t
2187	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	146	t
2188	117aa301-dacd-4478-a109-75367a341c6e	146	t
2189	347762d1-9ad3-49c9-a3e6-e23a4acb543f	146	t
2190	4a1009e0-5c97-43f8-855a-cf76127c497e	146	t
2191	0028f20a-ee47-46e8-b080-6c8d8ef20757	147	t
2192	814dde62-62f3-4869-9eae-126780cd0dd1	147	t
2193	5bcebe27-9064-49d2-bf8e-7d8086115367	147	t
2194	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	147	t
2195	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	147	t
2196	3fccd7be-eba3-46e0-8d63-0d3345bce933	147	t
2197	59ead2c9-8ba1-4b96-a661-07cfc76834d7	147	t
2198	9b67a16a-bf32-4398-8245-f971515c653d	147	t
2199	4b6b480c-bfad-4300-944c-995a1f83e153	147	t
2200	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	147	t
2201	019526ba-c2c2-4047-9afa-1730fb310179	147	t
2202	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	147	t
2203	117aa301-dacd-4478-a109-75367a341c6e	147	t
2204	347762d1-9ad3-49c9-a3e6-e23a4acb543f	147	t
2205	4a1009e0-5c97-43f8-855a-cf76127c497e	147	t
2206	0028f20a-ee47-46e8-b080-6c8d8ef20757	148	t
2207	814dde62-62f3-4869-9eae-126780cd0dd1	148	t
2208	5bcebe27-9064-49d2-bf8e-7d8086115367	148	t
2209	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	148	t
2210	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	148	t
2211	3fccd7be-eba3-46e0-8d63-0d3345bce933	148	t
2212	59ead2c9-8ba1-4b96-a661-07cfc76834d7	148	t
2213	9b67a16a-bf32-4398-8245-f971515c653d	148	t
2214	4b6b480c-bfad-4300-944c-995a1f83e153	148	t
2215	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	148	t
2216	019526ba-c2c2-4047-9afa-1730fb310179	148	t
2217	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	148	t
2218	117aa301-dacd-4478-a109-75367a341c6e	148	t
2219	347762d1-9ad3-49c9-a3e6-e23a4acb543f	148	t
2220	4a1009e0-5c97-43f8-855a-cf76127c497e	148	t
2221	0028f20a-ee47-46e8-b080-6c8d8ef20757	149	t
2222	814dde62-62f3-4869-9eae-126780cd0dd1	149	t
2223	5bcebe27-9064-49d2-bf8e-7d8086115367	149	t
2224	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	149	t
2225	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	149	t
2226	3fccd7be-eba3-46e0-8d63-0d3345bce933	149	t
2227	59ead2c9-8ba1-4b96-a661-07cfc76834d7	149	t
2228	9b67a16a-bf32-4398-8245-f971515c653d	149	t
2229	4b6b480c-bfad-4300-944c-995a1f83e153	149	t
2230	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	149	t
2231	019526ba-c2c2-4047-9afa-1730fb310179	149	t
2232	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	149	t
2233	117aa301-dacd-4478-a109-75367a341c6e	149	t
2234	347762d1-9ad3-49c9-a3e6-e23a4acb543f	149	t
2235	4a1009e0-5c97-43f8-855a-cf76127c497e	149	t
2236	0028f20a-ee47-46e8-b080-6c8d8ef20757	150	t
2237	814dde62-62f3-4869-9eae-126780cd0dd1	150	t
2238	5bcebe27-9064-49d2-bf8e-7d8086115367	150	t
2239	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	150	t
2240	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	150	t
2241	3fccd7be-eba3-46e0-8d63-0d3345bce933	150	t
2242	59ead2c9-8ba1-4b96-a661-07cfc76834d7	150	t
2243	9b67a16a-bf32-4398-8245-f971515c653d	150	t
2244	4b6b480c-bfad-4300-944c-995a1f83e153	150	t
2245	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	150	t
2246	019526ba-c2c2-4047-9afa-1730fb310179	150	t
2247	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	150	t
2248	117aa301-dacd-4478-a109-75367a341c6e	150	t
2249	347762d1-9ad3-49c9-a3e6-e23a4acb543f	150	t
2250	4a1009e0-5c97-43f8-855a-cf76127c497e	150	t
2251	0028f20a-ee47-46e8-b080-6c8d8ef20757	151	t
2252	814dde62-62f3-4869-9eae-126780cd0dd1	151	t
2253	5bcebe27-9064-49d2-bf8e-7d8086115367	151	t
2254	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	151	t
2255	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	151	t
2256	3fccd7be-eba3-46e0-8d63-0d3345bce933	151	t
2257	59ead2c9-8ba1-4b96-a661-07cfc76834d7	151	t
2258	9b67a16a-bf32-4398-8245-f971515c653d	151	t
2259	4b6b480c-bfad-4300-944c-995a1f83e153	151	t
2260	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	151	t
2261	019526ba-c2c2-4047-9afa-1730fb310179	151	t
2262	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	151	t
2263	117aa301-dacd-4478-a109-75367a341c6e	151	t
2264	347762d1-9ad3-49c9-a3e6-e23a4acb543f	151	t
2265	4a1009e0-5c97-43f8-855a-cf76127c497e	151	t
2266	0028f20a-ee47-46e8-b080-6c8d8ef20757	152	t
2267	814dde62-62f3-4869-9eae-126780cd0dd1	152	t
2268	5bcebe27-9064-49d2-bf8e-7d8086115367	152	t
2269	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	152	t
2270	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	152	t
2271	3fccd7be-eba3-46e0-8d63-0d3345bce933	152	t
2272	59ead2c9-8ba1-4b96-a661-07cfc76834d7	152	t
2273	9b67a16a-bf32-4398-8245-f971515c653d	152	t
2274	4b6b480c-bfad-4300-944c-995a1f83e153	152	t
2275	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	152	t
2276	019526ba-c2c2-4047-9afa-1730fb310179	152	t
2277	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	152	t
2278	117aa301-dacd-4478-a109-75367a341c6e	152	t
2279	347762d1-9ad3-49c9-a3e6-e23a4acb543f	152	t
2280	4a1009e0-5c97-43f8-855a-cf76127c497e	152	t
2281	0028f20a-ee47-46e8-b080-6c8d8ef20757	153	t
2282	814dde62-62f3-4869-9eae-126780cd0dd1	153	t
2283	5bcebe27-9064-49d2-bf8e-7d8086115367	153	t
2284	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	153	t
2285	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	153	t
2286	3fccd7be-eba3-46e0-8d63-0d3345bce933	153	t
2287	59ead2c9-8ba1-4b96-a661-07cfc76834d7	153	t
2288	9b67a16a-bf32-4398-8245-f971515c653d	153	t
2289	4b6b480c-bfad-4300-944c-995a1f83e153	153	t
2290	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	153	t
2291	019526ba-c2c2-4047-9afa-1730fb310179	153	t
2292	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	153	t
2293	117aa301-dacd-4478-a109-75367a341c6e	153	t
2294	347762d1-9ad3-49c9-a3e6-e23a4acb543f	153	t
2295	4a1009e0-5c97-43f8-855a-cf76127c497e	153	t
2296	0028f20a-ee47-46e8-b080-6c8d8ef20757	154	t
2297	814dde62-62f3-4869-9eae-126780cd0dd1	154	t
2298	5bcebe27-9064-49d2-bf8e-7d8086115367	154	t
2299	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	154	t
2300	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	154	t
2301	3fccd7be-eba3-46e0-8d63-0d3345bce933	154	t
2302	59ead2c9-8ba1-4b96-a661-07cfc76834d7	154	t
2303	9b67a16a-bf32-4398-8245-f971515c653d	154	t
2304	4b6b480c-bfad-4300-944c-995a1f83e153	154	t
2305	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	154	t
2306	019526ba-c2c2-4047-9afa-1730fb310179	154	t
2307	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	154	t
2308	117aa301-dacd-4478-a109-75367a341c6e	154	t
2309	347762d1-9ad3-49c9-a3e6-e23a4acb543f	154	t
2310	4a1009e0-5c97-43f8-855a-cf76127c497e	154	t
2311	0028f20a-ee47-46e8-b080-6c8d8ef20757	155	t
2312	814dde62-62f3-4869-9eae-126780cd0dd1	155	t
2313	5bcebe27-9064-49d2-bf8e-7d8086115367	155	t
2314	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	155	t
2315	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	155	t
2316	3fccd7be-eba3-46e0-8d63-0d3345bce933	155	t
2317	59ead2c9-8ba1-4b96-a661-07cfc76834d7	155	t
2318	9b67a16a-bf32-4398-8245-f971515c653d	155	t
2319	4b6b480c-bfad-4300-944c-995a1f83e153	155	t
2320	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	155	t
2321	019526ba-c2c2-4047-9afa-1730fb310179	155	t
2322	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	155	t
2323	117aa301-dacd-4478-a109-75367a341c6e	155	t
2324	347762d1-9ad3-49c9-a3e6-e23a4acb543f	155	t
2325	4a1009e0-5c97-43f8-855a-cf76127c497e	155	t
2326	0028f20a-ee47-46e8-b080-6c8d8ef20757	156	t
2327	814dde62-62f3-4869-9eae-126780cd0dd1	156	t
2328	5bcebe27-9064-49d2-bf8e-7d8086115367	156	t
2329	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	156	t
2330	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	156	t
2331	3fccd7be-eba3-46e0-8d63-0d3345bce933	156	t
2332	59ead2c9-8ba1-4b96-a661-07cfc76834d7	156	t
2333	9b67a16a-bf32-4398-8245-f971515c653d	156	t
2334	4b6b480c-bfad-4300-944c-995a1f83e153	156	t
2335	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	156	t
2336	019526ba-c2c2-4047-9afa-1730fb310179	156	t
2337	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	156	t
2338	117aa301-dacd-4478-a109-75367a341c6e	156	t
2339	347762d1-9ad3-49c9-a3e6-e23a4acb543f	156	t
2340	4a1009e0-5c97-43f8-855a-cf76127c497e	156	t
2341	0028f20a-ee47-46e8-b080-6c8d8ef20757	157	t
2342	814dde62-62f3-4869-9eae-126780cd0dd1	157	t
2343	5bcebe27-9064-49d2-bf8e-7d8086115367	157	t
2344	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	157	t
2345	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	157	t
2346	3fccd7be-eba3-46e0-8d63-0d3345bce933	157	t
2347	59ead2c9-8ba1-4b96-a661-07cfc76834d7	157	t
2348	9b67a16a-bf32-4398-8245-f971515c653d	157	t
2349	4b6b480c-bfad-4300-944c-995a1f83e153	157	t
2350	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	157	t
2351	019526ba-c2c2-4047-9afa-1730fb310179	157	t
2352	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	157	t
2353	117aa301-dacd-4478-a109-75367a341c6e	157	t
2354	347762d1-9ad3-49c9-a3e6-e23a4acb543f	157	t
2355	4a1009e0-5c97-43f8-855a-cf76127c497e	157	t
2356	0028f20a-ee47-46e8-b080-6c8d8ef20757	158	t
2357	814dde62-62f3-4869-9eae-126780cd0dd1	158	t
2358	5bcebe27-9064-49d2-bf8e-7d8086115367	158	t
2359	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	158	t
2360	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	158	t
2361	3fccd7be-eba3-46e0-8d63-0d3345bce933	158	t
2362	59ead2c9-8ba1-4b96-a661-07cfc76834d7	158	t
2363	9b67a16a-bf32-4398-8245-f971515c653d	158	t
2364	4b6b480c-bfad-4300-944c-995a1f83e153	158	t
2365	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	158	t
2366	019526ba-c2c2-4047-9afa-1730fb310179	158	t
2367	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	158	t
2368	117aa301-dacd-4478-a109-75367a341c6e	158	t
2369	347762d1-9ad3-49c9-a3e6-e23a4acb543f	158	t
2370	4a1009e0-5c97-43f8-855a-cf76127c497e	158	t
2371	0028f20a-ee47-46e8-b080-6c8d8ef20757	159	t
2372	814dde62-62f3-4869-9eae-126780cd0dd1	159	t
2373	5bcebe27-9064-49d2-bf8e-7d8086115367	159	t
2374	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	159	t
2375	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	159	t
2376	3fccd7be-eba3-46e0-8d63-0d3345bce933	159	t
2377	59ead2c9-8ba1-4b96-a661-07cfc76834d7	159	t
2378	9b67a16a-bf32-4398-8245-f971515c653d	159	t
2379	4b6b480c-bfad-4300-944c-995a1f83e153	159	t
2380	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	159	t
2381	019526ba-c2c2-4047-9afa-1730fb310179	159	t
2382	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	159	t
2383	117aa301-dacd-4478-a109-75367a341c6e	159	t
2384	347762d1-9ad3-49c9-a3e6-e23a4acb543f	159	t
2385	4a1009e0-5c97-43f8-855a-cf76127c497e	159	t
2386	0028f20a-ee47-46e8-b080-6c8d8ef20757	160	t
2387	814dde62-62f3-4869-9eae-126780cd0dd1	160	t
2388	5bcebe27-9064-49d2-bf8e-7d8086115367	160	t
2389	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	160	t
2390	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	160	t
2391	3fccd7be-eba3-46e0-8d63-0d3345bce933	160	t
2392	59ead2c9-8ba1-4b96-a661-07cfc76834d7	160	t
2393	9b67a16a-bf32-4398-8245-f971515c653d	160	t
2394	4b6b480c-bfad-4300-944c-995a1f83e153	160	t
2395	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	160	t
2396	019526ba-c2c2-4047-9afa-1730fb310179	160	t
2397	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	160	t
2398	117aa301-dacd-4478-a109-75367a341c6e	160	t
2399	347762d1-9ad3-49c9-a3e6-e23a4acb543f	160	t
2400	4a1009e0-5c97-43f8-855a-cf76127c497e	160	t
2401	0028f20a-ee47-46e8-b080-6c8d8ef20757	161	t
2402	814dde62-62f3-4869-9eae-126780cd0dd1	161	t
2403	5bcebe27-9064-49d2-bf8e-7d8086115367	161	t
2404	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	161	t
2405	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	161	t
2406	3fccd7be-eba3-46e0-8d63-0d3345bce933	161	t
2407	59ead2c9-8ba1-4b96-a661-07cfc76834d7	161	t
2408	9b67a16a-bf32-4398-8245-f971515c653d	161	t
2409	4b6b480c-bfad-4300-944c-995a1f83e153	161	t
2410	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	161	t
2411	019526ba-c2c2-4047-9afa-1730fb310179	161	t
2412	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	161	t
2413	117aa301-dacd-4478-a109-75367a341c6e	161	t
2414	347762d1-9ad3-49c9-a3e6-e23a4acb543f	161	t
2415	4a1009e0-5c97-43f8-855a-cf76127c497e	161	t
2416	0028f20a-ee47-46e8-b080-6c8d8ef20757	162	t
2417	814dde62-62f3-4869-9eae-126780cd0dd1	162	t
2418	5bcebe27-9064-49d2-bf8e-7d8086115367	162	t
2419	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	162	t
2420	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	162	t
2421	3fccd7be-eba3-46e0-8d63-0d3345bce933	162	t
2422	59ead2c9-8ba1-4b96-a661-07cfc76834d7	162	t
2423	9b67a16a-bf32-4398-8245-f971515c653d	162	t
2424	4b6b480c-bfad-4300-944c-995a1f83e153	162	t
2425	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	162	t
2426	019526ba-c2c2-4047-9afa-1730fb310179	162	t
2427	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	162	t
2428	117aa301-dacd-4478-a109-75367a341c6e	162	t
2429	347762d1-9ad3-49c9-a3e6-e23a4acb543f	162	t
2430	4a1009e0-5c97-43f8-855a-cf76127c497e	162	t
2431	0028f20a-ee47-46e8-b080-6c8d8ef20757	163	t
2432	814dde62-62f3-4869-9eae-126780cd0dd1	163	t
2433	5bcebe27-9064-49d2-bf8e-7d8086115367	163	t
2434	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	163	t
2435	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	163	t
2436	3fccd7be-eba3-46e0-8d63-0d3345bce933	163	t
2437	59ead2c9-8ba1-4b96-a661-07cfc76834d7	163	t
2438	9b67a16a-bf32-4398-8245-f971515c653d	163	t
2439	4b6b480c-bfad-4300-944c-995a1f83e153	163	t
2440	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	163	t
2441	019526ba-c2c2-4047-9afa-1730fb310179	163	t
2442	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	163	t
2443	117aa301-dacd-4478-a109-75367a341c6e	163	t
2444	347762d1-9ad3-49c9-a3e6-e23a4acb543f	163	t
2445	4a1009e0-5c97-43f8-855a-cf76127c497e	163	t
2446	0028f20a-ee47-46e8-b080-6c8d8ef20757	164	t
2447	814dde62-62f3-4869-9eae-126780cd0dd1	164	t
2448	5bcebe27-9064-49d2-bf8e-7d8086115367	164	t
2449	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	164	t
2450	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	164	t
2451	3fccd7be-eba3-46e0-8d63-0d3345bce933	164	t
2452	59ead2c9-8ba1-4b96-a661-07cfc76834d7	164	t
2453	9b67a16a-bf32-4398-8245-f971515c653d	164	t
2454	4b6b480c-bfad-4300-944c-995a1f83e153	164	t
2455	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	164	t
2456	019526ba-c2c2-4047-9afa-1730fb310179	164	t
2457	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	164	t
2458	117aa301-dacd-4478-a109-75367a341c6e	164	t
2459	347762d1-9ad3-49c9-a3e6-e23a4acb543f	164	t
2460	4a1009e0-5c97-43f8-855a-cf76127c497e	164	t
2461	0028f20a-ee47-46e8-b080-6c8d8ef20757	165	t
2462	814dde62-62f3-4869-9eae-126780cd0dd1	165	t
2463	5bcebe27-9064-49d2-bf8e-7d8086115367	165	t
2464	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	165	t
2465	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	165	t
2466	3fccd7be-eba3-46e0-8d63-0d3345bce933	165	t
2467	59ead2c9-8ba1-4b96-a661-07cfc76834d7	165	t
2468	9b67a16a-bf32-4398-8245-f971515c653d	165	t
2469	4b6b480c-bfad-4300-944c-995a1f83e153	165	t
2470	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	165	t
2471	019526ba-c2c2-4047-9afa-1730fb310179	165	t
2472	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	165	t
2473	117aa301-dacd-4478-a109-75367a341c6e	165	t
2474	347762d1-9ad3-49c9-a3e6-e23a4acb543f	165	t
2475	4a1009e0-5c97-43f8-855a-cf76127c497e	165	t
2476	0028f20a-ee47-46e8-b080-6c8d8ef20757	166	t
2477	814dde62-62f3-4869-9eae-126780cd0dd1	166	t
2478	5bcebe27-9064-49d2-bf8e-7d8086115367	166	t
2479	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	166	t
2480	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	166	t
2481	3fccd7be-eba3-46e0-8d63-0d3345bce933	166	t
2482	59ead2c9-8ba1-4b96-a661-07cfc76834d7	166	t
2483	9b67a16a-bf32-4398-8245-f971515c653d	166	t
2484	4b6b480c-bfad-4300-944c-995a1f83e153	166	t
2485	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	166	t
2486	019526ba-c2c2-4047-9afa-1730fb310179	166	t
2487	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	166	t
2488	117aa301-dacd-4478-a109-75367a341c6e	166	t
2489	347762d1-9ad3-49c9-a3e6-e23a4acb543f	166	t
2490	4a1009e0-5c97-43f8-855a-cf76127c497e	166	t
2491	0028f20a-ee47-46e8-b080-6c8d8ef20757	167	t
2492	814dde62-62f3-4869-9eae-126780cd0dd1	167	t
2493	5bcebe27-9064-49d2-bf8e-7d8086115367	167	t
2494	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	167	t
2495	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	167	t
2496	3fccd7be-eba3-46e0-8d63-0d3345bce933	167	t
2497	59ead2c9-8ba1-4b96-a661-07cfc76834d7	167	t
2498	9b67a16a-bf32-4398-8245-f971515c653d	167	t
2499	4b6b480c-bfad-4300-944c-995a1f83e153	167	t
2500	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	167	t
2501	019526ba-c2c2-4047-9afa-1730fb310179	167	t
2502	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	167	t
2503	117aa301-dacd-4478-a109-75367a341c6e	167	t
2504	347762d1-9ad3-49c9-a3e6-e23a4acb543f	167	t
2505	4a1009e0-5c97-43f8-855a-cf76127c497e	167	t
2506	0028f20a-ee47-46e8-b080-6c8d8ef20757	168	t
2507	814dde62-62f3-4869-9eae-126780cd0dd1	168	t
2508	5bcebe27-9064-49d2-bf8e-7d8086115367	168	t
2509	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	168	t
2510	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	168	t
2511	3fccd7be-eba3-46e0-8d63-0d3345bce933	168	t
2512	59ead2c9-8ba1-4b96-a661-07cfc76834d7	168	t
2513	9b67a16a-bf32-4398-8245-f971515c653d	168	t
2514	4b6b480c-bfad-4300-944c-995a1f83e153	168	t
2515	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	168	t
2516	019526ba-c2c2-4047-9afa-1730fb310179	168	t
2517	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	168	t
2518	117aa301-dacd-4478-a109-75367a341c6e	168	t
2519	347762d1-9ad3-49c9-a3e6-e23a4acb543f	168	t
2520	4a1009e0-5c97-43f8-855a-cf76127c497e	168	t
2521	0028f20a-ee47-46e8-b080-6c8d8ef20757	169	t
2522	814dde62-62f3-4869-9eae-126780cd0dd1	169	t
2523	5bcebe27-9064-49d2-bf8e-7d8086115367	169	t
2524	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	169	t
2525	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	169	t
2526	3fccd7be-eba3-46e0-8d63-0d3345bce933	169	t
2527	59ead2c9-8ba1-4b96-a661-07cfc76834d7	169	t
2528	9b67a16a-bf32-4398-8245-f971515c653d	169	t
2529	4b6b480c-bfad-4300-944c-995a1f83e153	169	t
2530	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	169	t
2531	019526ba-c2c2-4047-9afa-1730fb310179	169	t
2532	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	169	t
2533	117aa301-dacd-4478-a109-75367a341c6e	169	t
2534	347762d1-9ad3-49c9-a3e6-e23a4acb543f	169	t
2535	4a1009e0-5c97-43f8-855a-cf76127c497e	169	t
2536	0028f20a-ee47-46e8-b080-6c8d8ef20757	170	t
2537	814dde62-62f3-4869-9eae-126780cd0dd1	170	t
2538	5bcebe27-9064-49d2-bf8e-7d8086115367	170	t
2539	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	170	t
2540	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	170	t
2541	3fccd7be-eba3-46e0-8d63-0d3345bce933	170	t
2542	59ead2c9-8ba1-4b96-a661-07cfc76834d7	170	t
2543	9b67a16a-bf32-4398-8245-f971515c653d	170	t
2544	4b6b480c-bfad-4300-944c-995a1f83e153	170	t
2545	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	170	t
2546	019526ba-c2c2-4047-9afa-1730fb310179	170	t
2547	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	170	t
2548	117aa301-dacd-4478-a109-75367a341c6e	170	t
2549	347762d1-9ad3-49c9-a3e6-e23a4acb543f	170	t
2550	4a1009e0-5c97-43f8-855a-cf76127c497e	170	t
2551	0028f20a-ee47-46e8-b080-6c8d8ef20757	171	t
2552	814dde62-62f3-4869-9eae-126780cd0dd1	171	t
2553	5bcebe27-9064-49d2-bf8e-7d8086115367	171	t
2554	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	171	t
2555	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	171	t
2556	3fccd7be-eba3-46e0-8d63-0d3345bce933	171	t
2557	59ead2c9-8ba1-4b96-a661-07cfc76834d7	171	t
2558	9b67a16a-bf32-4398-8245-f971515c653d	171	t
2559	4b6b480c-bfad-4300-944c-995a1f83e153	171	t
2560	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	171	t
2561	019526ba-c2c2-4047-9afa-1730fb310179	171	t
2562	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	171	t
2563	117aa301-dacd-4478-a109-75367a341c6e	171	t
2564	347762d1-9ad3-49c9-a3e6-e23a4acb543f	171	t
2565	4a1009e0-5c97-43f8-855a-cf76127c497e	171	t
2566	0028f20a-ee47-46e8-b080-6c8d8ef20757	172	t
2567	814dde62-62f3-4869-9eae-126780cd0dd1	172	t
2568	5bcebe27-9064-49d2-bf8e-7d8086115367	172	t
2569	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	172	t
2570	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	172	t
2571	3fccd7be-eba3-46e0-8d63-0d3345bce933	172	t
2572	59ead2c9-8ba1-4b96-a661-07cfc76834d7	172	t
2573	9b67a16a-bf32-4398-8245-f971515c653d	172	t
2574	4b6b480c-bfad-4300-944c-995a1f83e153	172	t
2575	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	172	t
2576	019526ba-c2c2-4047-9afa-1730fb310179	172	t
2577	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	172	t
2578	117aa301-dacd-4478-a109-75367a341c6e	172	t
2579	347762d1-9ad3-49c9-a3e6-e23a4acb543f	172	t
2580	4a1009e0-5c97-43f8-855a-cf76127c497e	172	t
2581	0028f20a-ee47-46e8-b080-6c8d8ef20757	173	t
2582	814dde62-62f3-4869-9eae-126780cd0dd1	173	t
2583	5bcebe27-9064-49d2-bf8e-7d8086115367	173	t
2584	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	173	t
2585	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	173	t
2586	3fccd7be-eba3-46e0-8d63-0d3345bce933	173	t
2587	59ead2c9-8ba1-4b96-a661-07cfc76834d7	173	t
2588	9b67a16a-bf32-4398-8245-f971515c653d	173	t
2589	4b6b480c-bfad-4300-944c-995a1f83e153	173	t
2590	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	173	t
2591	019526ba-c2c2-4047-9afa-1730fb310179	173	t
2592	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	173	t
2593	117aa301-dacd-4478-a109-75367a341c6e	173	t
2594	347762d1-9ad3-49c9-a3e6-e23a4acb543f	173	t
2595	4a1009e0-5c97-43f8-855a-cf76127c497e	173	t
2596	0028f20a-ee47-46e8-b080-6c8d8ef20757	174	t
2597	814dde62-62f3-4869-9eae-126780cd0dd1	174	t
2598	5bcebe27-9064-49d2-bf8e-7d8086115367	174	t
2599	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	174	t
2600	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	174	t
2601	3fccd7be-eba3-46e0-8d63-0d3345bce933	174	t
2602	59ead2c9-8ba1-4b96-a661-07cfc76834d7	174	t
2603	9b67a16a-bf32-4398-8245-f971515c653d	174	t
2604	4b6b480c-bfad-4300-944c-995a1f83e153	174	t
2605	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	174	t
2606	019526ba-c2c2-4047-9afa-1730fb310179	174	t
2607	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	174	t
2608	117aa301-dacd-4478-a109-75367a341c6e	174	t
2609	347762d1-9ad3-49c9-a3e6-e23a4acb543f	174	t
2610	4a1009e0-5c97-43f8-855a-cf76127c497e	174	t
2611	0028f20a-ee47-46e8-b080-6c8d8ef20757	175	t
2612	814dde62-62f3-4869-9eae-126780cd0dd1	175	t
2613	5bcebe27-9064-49d2-bf8e-7d8086115367	175	t
2614	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	175	t
2615	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	175	t
2616	3fccd7be-eba3-46e0-8d63-0d3345bce933	175	t
2617	59ead2c9-8ba1-4b96-a661-07cfc76834d7	175	t
2618	9b67a16a-bf32-4398-8245-f971515c653d	175	t
2619	4b6b480c-bfad-4300-944c-995a1f83e153	175	t
2620	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	175	t
2621	019526ba-c2c2-4047-9afa-1730fb310179	175	t
2622	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	175	t
2623	117aa301-dacd-4478-a109-75367a341c6e	175	t
2624	347762d1-9ad3-49c9-a3e6-e23a4acb543f	175	t
2625	4a1009e0-5c97-43f8-855a-cf76127c497e	175	t
2626	0028f20a-ee47-46e8-b080-6c8d8ef20757	176	t
2627	814dde62-62f3-4869-9eae-126780cd0dd1	176	t
2628	5bcebe27-9064-49d2-bf8e-7d8086115367	176	t
2629	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	176	t
2630	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	176	t
2631	3fccd7be-eba3-46e0-8d63-0d3345bce933	176	t
2632	59ead2c9-8ba1-4b96-a661-07cfc76834d7	176	t
2633	9b67a16a-bf32-4398-8245-f971515c653d	176	t
2634	4b6b480c-bfad-4300-944c-995a1f83e153	176	t
2635	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	176	t
2636	019526ba-c2c2-4047-9afa-1730fb310179	176	t
2637	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	176	t
2638	117aa301-dacd-4478-a109-75367a341c6e	176	t
2639	347762d1-9ad3-49c9-a3e6-e23a4acb543f	176	t
2640	4a1009e0-5c97-43f8-855a-cf76127c497e	176	t
2641	0028f20a-ee47-46e8-b080-6c8d8ef20757	177	t
2642	814dde62-62f3-4869-9eae-126780cd0dd1	177	t
2643	5bcebe27-9064-49d2-bf8e-7d8086115367	177	t
2644	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	177	t
2645	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	177	t
2646	3fccd7be-eba3-46e0-8d63-0d3345bce933	177	t
2647	59ead2c9-8ba1-4b96-a661-07cfc76834d7	177	t
2648	9b67a16a-bf32-4398-8245-f971515c653d	177	t
2649	4b6b480c-bfad-4300-944c-995a1f83e153	177	t
2650	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	177	t
2651	019526ba-c2c2-4047-9afa-1730fb310179	177	t
2652	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	177	t
2653	117aa301-dacd-4478-a109-75367a341c6e	177	t
2654	347762d1-9ad3-49c9-a3e6-e23a4acb543f	177	t
2655	4a1009e0-5c97-43f8-855a-cf76127c497e	177	t
2656	0028f20a-ee47-46e8-b080-6c8d8ef20757	178	t
2657	814dde62-62f3-4869-9eae-126780cd0dd1	178	t
2658	5bcebe27-9064-49d2-bf8e-7d8086115367	178	t
2659	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	178	t
2660	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	178	t
2661	3fccd7be-eba3-46e0-8d63-0d3345bce933	178	t
2662	59ead2c9-8ba1-4b96-a661-07cfc76834d7	178	t
2663	9b67a16a-bf32-4398-8245-f971515c653d	178	t
2664	4b6b480c-bfad-4300-944c-995a1f83e153	178	t
2665	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	178	t
2666	019526ba-c2c2-4047-9afa-1730fb310179	178	t
2667	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	178	t
2668	117aa301-dacd-4478-a109-75367a341c6e	178	t
2669	347762d1-9ad3-49c9-a3e6-e23a4acb543f	178	t
2670	4a1009e0-5c97-43f8-855a-cf76127c497e	178	t
2671	0028f20a-ee47-46e8-b080-6c8d8ef20757	179	t
2672	814dde62-62f3-4869-9eae-126780cd0dd1	179	t
2673	5bcebe27-9064-49d2-bf8e-7d8086115367	179	t
2674	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	179	t
2675	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	179	t
2676	3fccd7be-eba3-46e0-8d63-0d3345bce933	179	t
2677	59ead2c9-8ba1-4b96-a661-07cfc76834d7	179	t
2678	9b67a16a-bf32-4398-8245-f971515c653d	179	t
2679	4b6b480c-bfad-4300-944c-995a1f83e153	179	t
2680	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	179	t
2681	019526ba-c2c2-4047-9afa-1730fb310179	179	t
2682	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	179	t
2683	117aa301-dacd-4478-a109-75367a341c6e	179	t
2684	347762d1-9ad3-49c9-a3e6-e23a4acb543f	179	t
2685	4a1009e0-5c97-43f8-855a-cf76127c497e	179	t
2686	0028f20a-ee47-46e8-b080-6c8d8ef20757	180	t
2687	814dde62-62f3-4869-9eae-126780cd0dd1	180	t
2688	5bcebe27-9064-49d2-bf8e-7d8086115367	180	t
2689	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	180	t
2690	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	180	t
2691	3fccd7be-eba3-46e0-8d63-0d3345bce933	180	t
2692	59ead2c9-8ba1-4b96-a661-07cfc76834d7	180	t
2693	9b67a16a-bf32-4398-8245-f971515c653d	180	t
2694	4b6b480c-bfad-4300-944c-995a1f83e153	180	t
2695	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	180	t
2696	019526ba-c2c2-4047-9afa-1730fb310179	180	t
2697	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	180	t
2698	117aa301-dacd-4478-a109-75367a341c6e	180	t
2699	347762d1-9ad3-49c9-a3e6-e23a4acb543f	180	t
2700	4a1009e0-5c97-43f8-855a-cf76127c497e	180	t
2701	0028f20a-ee47-46e8-b080-6c8d8ef20757	181	t
2702	814dde62-62f3-4869-9eae-126780cd0dd1	181	t
2703	5bcebe27-9064-49d2-bf8e-7d8086115367	181	t
2704	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	181	t
2705	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	181	t
2706	3fccd7be-eba3-46e0-8d63-0d3345bce933	181	t
2707	59ead2c9-8ba1-4b96-a661-07cfc76834d7	181	t
2708	9b67a16a-bf32-4398-8245-f971515c653d	181	t
2709	4b6b480c-bfad-4300-944c-995a1f83e153	181	t
2710	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	181	t
2711	019526ba-c2c2-4047-9afa-1730fb310179	181	t
2712	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	181	t
2713	117aa301-dacd-4478-a109-75367a341c6e	181	t
2714	347762d1-9ad3-49c9-a3e6-e23a4acb543f	181	t
2715	4a1009e0-5c97-43f8-855a-cf76127c497e	181	t
2716	0028f20a-ee47-46e8-b080-6c8d8ef20757	182	t
2717	814dde62-62f3-4869-9eae-126780cd0dd1	182	t
2718	5bcebe27-9064-49d2-bf8e-7d8086115367	182	t
2719	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	182	t
2720	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	182	t
2721	3fccd7be-eba3-46e0-8d63-0d3345bce933	182	t
2722	59ead2c9-8ba1-4b96-a661-07cfc76834d7	182	t
2723	9b67a16a-bf32-4398-8245-f971515c653d	182	t
2724	4b6b480c-bfad-4300-944c-995a1f83e153	182	t
2725	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	182	t
2726	019526ba-c2c2-4047-9afa-1730fb310179	182	t
2727	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	182	t
2728	117aa301-dacd-4478-a109-75367a341c6e	182	t
2729	347762d1-9ad3-49c9-a3e6-e23a4acb543f	182	t
2730	4a1009e0-5c97-43f8-855a-cf76127c497e	182	t
2731	0028f20a-ee47-46e8-b080-6c8d8ef20757	183	t
2732	814dde62-62f3-4869-9eae-126780cd0dd1	183	t
2733	5bcebe27-9064-49d2-bf8e-7d8086115367	183	t
2734	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	183	t
2735	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	183	t
2736	3fccd7be-eba3-46e0-8d63-0d3345bce933	183	t
2737	59ead2c9-8ba1-4b96-a661-07cfc76834d7	183	t
2738	9b67a16a-bf32-4398-8245-f971515c653d	183	t
2739	4b6b480c-bfad-4300-944c-995a1f83e153	183	t
2740	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	183	t
2741	019526ba-c2c2-4047-9afa-1730fb310179	183	t
2742	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	183	t
2743	117aa301-dacd-4478-a109-75367a341c6e	183	t
2744	347762d1-9ad3-49c9-a3e6-e23a4acb543f	183	t
2745	4a1009e0-5c97-43f8-855a-cf76127c497e	183	t
2746	0028f20a-ee47-46e8-b080-6c8d8ef20757	184	t
2747	814dde62-62f3-4869-9eae-126780cd0dd1	184	t
2748	5bcebe27-9064-49d2-bf8e-7d8086115367	184	t
2749	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	184	t
2750	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	184	t
2751	3fccd7be-eba3-46e0-8d63-0d3345bce933	184	t
2752	59ead2c9-8ba1-4b96-a661-07cfc76834d7	184	t
2753	9b67a16a-bf32-4398-8245-f971515c653d	184	t
2754	4b6b480c-bfad-4300-944c-995a1f83e153	184	t
2755	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	184	t
2756	019526ba-c2c2-4047-9afa-1730fb310179	184	t
2757	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	184	t
2758	117aa301-dacd-4478-a109-75367a341c6e	184	t
2759	347762d1-9ad3-49c9-a3e6-e23a4acb543f	184	t
2760	4a1009e0-5c97-43f8-855a-cf76127c497e	184	t
2761	0028f20a-ee47-46e8-b080-6c8d8ef20757	185	t
2762	814dde62-62f3-4869-9eae-126780cd0dd1	185	t
2763	5bcebe27-9064-49d2-bf8e-7d8086115367	185	t
2764	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	185	t
2765	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	185	t
2766	3fccd7be-eba3-46e0-8d63-0d3345bce933	185	t
2767	59ead2c9-8ba1-4b96-a661-07cfc76834d7	185	t
2768	9b67a16a-bf32-4398-8245-f971515c653d	185	t
2769	4b6b480c-bfad-4300-944c-995a1f83e153	185	t
2770	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	185	t
2771	019526ba-c2c2-4047-9afa-1730fb310179	185	t
2772	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	185	t
2773	117aa301-dacd-4478-a109-75367a341c6e	185	t
2774	347762d1-9ad3-49c9-a3e6-e23a4acb543f	185	t
2775	4a1009e0-5c97-43f8-855a-cf76127c497e	185	t
2776	0028f20a-ee47-46e8-b080-6c8d8ef20757	186	t
2777	814dde62-62f3-4869-9eae-126780cd0dd1	186	t
2778	5bcebe27-9064-49d2-bf8e-7d8086115367	186	t
2779	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	186	t
2780	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	186	t
2781	3fccd7be-eba3-46e0-8d63-0d3345bce933	186	t
2782	59ead2c9-8ba1-4b96-a661-07cfc76834d7	186	t
2783	9b67a16a-bf32-4398-8245-f971515c653d	186	t
2784	4b6b480c-bfad-4300-944c-995a1f83e153	186	t
2785	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	186	t
2786	019526ba-c2c2-4047-9afa-1730fb310179	186	t
2787	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	186	t
2788	117aa301-dacd-4478-a109-75367a341c6e	186	t
2789	347762d1-9ad3-49c9-a3e6-e23a4acb543f	186	t
2790	4a1009e0-5c97-43f8-855a-cf76127c497e	186	t
2791	0028f20a-ee47-46e8-b080-6c8d8ef20757	187	t
2792	814dde62-62f3-4869-9eae-126780cd0dd1	187	t
2793	5bcebe27-9064-49d2-bf8e-7d8086115367	187	t
2794	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	187	t
2795	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	187	t
2796	3fccd7be-eba3-46e0-8d63-0d3345bce933	187	t
2797	59ead2c9-8ba1-4b96-a661-07cfc76834d7	187	t
2798	9b67a16a-bf32-4398-8245-f971515c653d	187	t
2799	4b6b480c-bfad-4300-944c-995a1f83e153	187	t
2800	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	187	t
2801	019526ba-c2c2-4047-9afa-1730fb310179	187	t
2802	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	187	t
2803	117aa301-dacd-4478-a109-75367a341c6e	187	t
2804	347762d1-9ad3-49c9-a3e6-e23a4acb543f	187	t
2805	4a1009e0-5c97-43f8-855a-cf76127c497e	187	t
2806	0028f20a-ee47-46e8-b080-6c8d8ef20757	188	t
2807	814dde62-62f3-4869-9eae-126780cd0dd1	188	t
2808	5bcebe27-9064-49d2-bf8e-7d8086115367	188	t
2809	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	188	t
2810	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	188	t
2811	3fccd7be-eba3-46e0-8d63-0d3345bce933	188	t
2812	59ead2c9-8ba1-4b96-a661-07cfc76834d7	188	t
2813	9b67a16a-bf32-4398-8245-f971515c653d	188	t
2814	4b6b480c-bfad-4300-944c-995a1f83e153	188	t
2815	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	188	t
2816	019526ba-c2c2-4047-9afa-1730fb310179	188	t
2817	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	188	t
2818	117aa301-dacd-4478-a109-75367a341c6e	188	t
2819	347762d1-9ad3-49c9-a3e6-e23a4acb543f	188	t
2820	4a1009e0-5c97-43f8-855a-cf76127c497e	188	t
2821	0028f20a-ee47-46e8-b080-6c8d8ef20757	189	t
2822	814dde62-62f3-4869-9eae-126780cd0dd1	189	t
2823	5bcebe27-9064-49d2-bf8e-7d8086115367	189	t
2824	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	189	t
2825	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	189	t
2826	3fccd7be-eba3-46e0-8d63-0d3345bce933	189	t
2827	59ead2c9-8ba1-4b96-a661-07cfc76834d7	189	t
2828	9b67a16a-bf32-4398-8245-f971515c653d	189	t
2829	4b6b480c-bfad-4300-944c-995a1f83e153	189	t
2830	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	189	t
2831	019526ba-c2c2-4047-9afa-1730fb310179	189	t
2832	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	189	t
2833	117aa301-dacd-4478-a109-75367a341c6e	189	t
2834	347762d1-9ad3-49c9-a3e6-e23a4acb543f	189	t
2835	4a1009e0-5c97-43f8-855a-cf76127c497e	189	t
2836	0028f20a-ee47-46e8-b080-6c8d8ef20757	190	t
2837	814dde62-62f3-4869-9eae-126780cd0dd1	190	t
2838	5bcebe27-9064-49d2-bf8e-7d8086115367	190	t
2839	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	190	t
2840	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	190	t
2841	3fccd7be-eba3-46e0-8d63-0d3345bce933	190	t
2842	59ead2c9-8ba1-4b96-a661-07cfc76834d7	190	t
2843	9b67a16a-bf32-4398-8245-f971515c653d	190	t
2844	4b6b480c-bfad-4300-944c-995a1f83e153	190	t
2845	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	190	t
2846	019526ba-c2c2-4047-9afa-1730fb310179	190	t
2847	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	190	t
2848	117aa301-dacd-4478-a109-75367a341c6e	190	t
2849	347762d1-9ad3-49c9-a3e6-e23a4acb543f	190	t
2850	4a1009e0-5c97-43f8-855a-cf76127c497e	190	t
2851	0028f20a-ee47-46e8-b080-6c8d8ef20757	191	t
2852	814dde62-62f3-4869-9eae-126780cd0dd1	191	t
2853	5bcebe27-9064-49d2-bf8e-7d8086115367	191	t
2854	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	191	t
2855	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	191	t
2856	3fccd7be-eba3-46e0-8d63-0d3345bce933	191	t
2857	59ead2c9-8ba1-4b96-a661-07cfc76834d7	191	t
2858	9b67a16a-bf32-4398-8245-f971515c653d	191	t
2859	4b6b480c-bfad-4300-944c-995a1f83e153	191	t
2860	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	191	t
2861	019526ba-c2c2-4047-9afa-1730fb310179	191	t
2862	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	191	t
2863	117aa301-dacd-4478-a109-75367a341c6e	191	t
2864	347762d1-9ad3-49c9-a3e6-e23a4acb543f	191	t
2865	4a1009e0-5c97-43f8-855a-cf76127c497e	191	t
2866	0028f20a-ee47-46e8-b080-6c8d8ef20757	192	t
2867	814dde62-62f3-4869-9eae-126780cd0dd1	192	t
2868	5bcebe27-9064-49d2-bf8e-7d8086115367	192	t
2869	c0b37fcc-0e59-46de-a22c-61be65c3c8aa	192	t
2870	2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	192	t
2871	3fccd7be-eba3-46e0-8d63-0d3345bce933	192	t
2872	59ead2c9-8ba1-4b96-a661-07cfc76834d7	192	t
2873	9b67a16a-bf32-4398-8245-f971515c653d	192	t
2874	4b6b480c-bfad-4300-944c-995a1f83e153	192	t
2875	4d981ef4-e187-4fa9-8790-eb7188d9bd8f	192	t
2876	019526ba-c2c2-4047-9afa-1730fb310179	192	t
2877	ee9d650b-b1d2-4400-aaa8-2187900fa9ae	192	t
2878	117aa301-dacd-4478-a109-75367a341c6e	192	t
2879	347762d1-9ad3-49c9-a3e6-e23a4acb543f	192	t
2880	4a1009e0-5c97-43f8-855a-cf76127c497e	192	t
7	1fa3666d-771f-485f-ad36-69868c23d624	1	f
22	1fa3666d-771f-485f-ad36-69868c23d624	2	f
142	1fa3666d-771f-485f-ad36-69868c23d624	10	f
\.


--
-- Data for Name: showrooms; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.showrooms (showroom_id, theater_id, showroom_num, number_seats) FROM stdin;
1	1	1	96
2	1	2	96
\.


--
-- Data for Name: showtimes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.showtimes (show_id, showroom_id, movie_id, date, "time", duration) FROM stdin;
6fc874f5-e524-4692-b482-6f15c5da413b	1	1	2026-04-11 14:00:00	2026-04-11 14:00:00	127
0311480b-5c14-4c4f-a5ca-cdd6c7ef7196	1	1	2026-04-11 17:00:00	2026-04-11 17:00:00	127
91778966-2712-4ad9-b278-6b0a96148cc1	1	1	2026-04-11 20:00:00	2026-04-11 20:00:00	127
73a3a82e-468b-4665-92ae-5e9d5d0d432b	1	2	2026-04-11 14:00:00	2026-04-11 14:00:00	99
e1653523-be47-48cc-a3c0-d664104bfd4b	1	2	2026-04-11 17:00:00	2026-04-11 17:00:00	99
422bc56c-3368-415c-b822-5a701c607409	1	2	2026-04-11 20:00:00	2026-04-11 20:00:00	99
f0187098-7164-4557-a514-e4f12cab7b29	1	3	2026-04-11 14:00:00	2026-04-11 14:00:00	115
8039d3d3-260f-452a-a8c6-f59f427853b2	1	3	2026-04-11 17:00:00	2026-04-11 17:00:00	115
1fa3666d-771f-485f-ad36-69868c23d624	1	3	2026-04-11 20:00:00	2026-04-11 20:00:00	115
fb16cfc3-acf4-4b94-8a76-ebae3ccc7efb	1	4	2026-04-11 14:00:00	2026-04-11 14:00:00	150
399ef9d7-e57a-497f-850f-4203986eb932	1	4	2026-04-11 17:00:00	2026-04-11 17:00:00	150
5f5d1793-a7f4-438b-8344-06973689b35b	1	4	2026-04-11 20:00:00	2026-04-11 20:00:00	150
5050a3e0-947b-4319-be05-15ac1d8c9def	1	5	2026-04-11 14:00:00	2026-04-11 14:00:00	112
5f69d7cf-53b7-4fa1-b6c0-38e366bc84f5	1	5	2026-04-11 17:00:00	2026-04-11 17:00:00	112
05713b51-d123-4e90-933f-900940b4f82d	1	5	2026-04-11 20:00:00	2026-04-11 20:00:00	112
4a1009e0-5c97-43f8-855a-cf76127c497e	2	6	2026-04-11 14:00:00	2026-04-11 14:00:00	113
347762d1-9ad3-49c9-a3e6-e23a4acb543f	2	6	2026-04-11 17:00:00	2026-04-11 17:00:00	113
117aa301-dacd-4478-a109-75367a341c6e	2	6	2026-04-11 20:00:00	2026-04-11 20:00:00	113
ee9d650b-b1d2-4400-aaa8-2187900fa9ae	2	7	2026-04-11 14:00:00	2026-04-11 14:00:00	73
019526ba-c2c2-4047-9afa-1730fb310179	2	7	2026-04-11 17:00:00	2026-04-11 17:00:00	73
4d981ef4-e187-4fa9-8790-eb7188d9bd8f	2	7	2026-04-11 20:00:00	2026-04-11 20:00:00	73
4b6b480c-bfad-4300-944c-995a1f83e153	2	8	2026-04-11 14:00:00	2026-04-11 14:00:00	91
9b67a16a-bf32-4398-8245-f971515c653d	2	8	2026-04-11 17:00:00	2026-04-11 17:00:00	91
59ead2c9-8ba1-4b96-a661-07cfc76834d7	2	8	2026-04-11 20:00:00	2026-04-11 20:00:00	91
3fccd7be-eba3-46e0-8d63-0d3345bce933	2	9	2026-04-11 14:00:00	2026-04-11 14:00:00	170
2f32a7fd-d6b1-44af-b004-daa4f1c9ae51	2	9	2026-04-11 17:00:00	2026-04-11 17:00:00	170
c0b37fcc-0e59-46de-a22c-61be65c3c8aa	2	9	2026-04-11 20:00:00	2026-04-11 20:00:00	170
5bcebe27-9064-49d2-bf8e-7d8086115367	2	10	2026-04-11 14:00:00	2026-04-11 14:00:00	150
814dde62-62f3-4869-9eae-126780cd0dd1	2	10	2026-04-11 17:00:00	2026-04-11 17:00:00	150
0028f20a-ee47-46e8-b080-6c8d8ef20757	2	10	2026-04-11 20:00:00	2026-04-11 20:00:00	150
\.


--
-- Data for Name: theaters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.theaters (theater_id, name) FROM stdin;
1	Cinema
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tickets (ticket_number, booking_id, show_seat_id, type, price) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (user_id, email, password, phone_number, receives_promos, user_type, verified, first_name, last_name) FROM stdin;
d7a51b45-85ea-4d31-8282-2351c514205f	rd74382@uga.edu	$2b$10$M0AXNsH4XazgSs5Z5.4.CedhnBTVVTy3UrbmS/uU1fksnKOtFa.Qi	\N	t	CUSTOMER	t	rishi	damaraju
1a63b501-9c4f-4a26-a75c-43151156ce60	jl68110@uga.edu	$2b$12$MXYQXTdpkKxoelGm3Hyuj.NY4tlHRhM96GDhS..CfROFds3bQE.bK	6543654365	f	CUSTOMER	t	John	Smith
c4a3fc06-7d73-4e29-bb42-b2afcef69d22	sinkinsheep@gmail.com	$2b$10$UYQMgYxCXw/oNz93bPv4sOnZA/lOggcGbJRvPvEl1j.qngXC75j.2	\N	t	CUSTOMER	t	first	last
de58840c-29ac-404e-8bce-884eee20c49d	sahirc2184@gmail.com	$2b$10$.hkfvhEFwvGsfLgElfDP.eRNEcLYXLiRrw/9sNsWxa/A.Ord0P14K	\N	t	CUSTOMER	f	Sahir	Chowdhury
9186b55b-dbba-46af-8c18-beeaa2a60a76	sac06312@uga.edu	$2b$10$iLahlQPfpQGBoQPWi843v.Y1qRgoNx1.RaJldpApTkSNACYPe4mv6	\N	t	CUSTOMER	t	Sahir	Chowdhury
61c32904-52ec-432c-b694-420f659c39ad	rishidamaraju@gmail.com	$2b$12$4mHJKEB4RiDlgLYg2eYSUu8U121ah8xkOxT/FVHWnivqCp3EZ7uUG	\N	f	CUSTOMER	t	rishi	damaraju
59d57e48-b907-4365-92c6-1029a2458333	jeffrey.luo.2024@gmail.com	$2b$10$fvE.HnP5ZoXxCznmG2X14.U/bzMqF5i3Biz9nfGIQ/fFFYNRmlSwy	6785991276	t	ADMIN	t	jeff	luo
\.


--
-- Name: actors_actor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.actors_actor_id_seq', 33, true);


--
-- Name: customer_genre_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.customer_genre_preferences_id_seq', 1, false);


--
-- Name: directors_director_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.directors_director_id_seq', 10, true);


--
-- Name: genres_genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.genres_genre_id_seq', 18, true);


--
-- Name: mailing_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mailing_address_id_seq', 4, true);


--
-- Name: movies_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.movies_movie_id_seq', 10, true);


--
-- Name: producers_producer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.producers_producer_id_seq', 28, true);


--
-- Name: seats_seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.seats_seat_id_seq', 192, true);


--
-- Name: show_seats_show_seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.show_seats_show_seat_id_seq', 2880, true);


--
-- Name: showrooms_showroom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.showrooms_showroom_id_seq', 4, true);


--
-- Name: theaters_theater_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.theaters_theater_id_seq', 2, true);


--
-- Name: actors actors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_pkey PRIMARY KEY (actor_id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- Name: customer_favorite_movies customer_favorite_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_favorite_movies
    ADD CONSTRAINT customer_favorite_movies_pkey PRIMARY KEY (customer_id, movie_id);


--
-- Name: customer_genre_preferences customer_genre_preferences_customer_id_genre_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_genre_preferences
    ADD CONSTRAINT customer_genre_preferences_customer_id_genre_id_key UNIQUE (customer_id, genre_id);


--
-- Name: customer_genre_preferences customer_genre_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_genre_preferences
    ADD CONSTRAINT customer_genre_preferences_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- Name: directors directors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.directors
    ADD CONSTRAINT directors_pkey PRIMARY KEY (director_id);


--
-- Name: users email; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT email UNIQUE (email);


--
-- Name: email_verifications email_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verifications
    ADD CONSTRAINT email_verifications_pkey PRIMARY KEY (user_id);


--
-- Name: genres genres_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_name_key UNIQUE (name);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (genre_id);


--
-- Name: mailing_address mailing_address_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mailing_address
    ADD CONSTRAINT mailing_address_customer_id_key UNIQUE (customer_id);


--
-- Name: mailing_address mailing_address_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mailing_address
    ADD CONSTRAINT mailing_address_pkey PRIMARY KEY (id);


--
-- Name: movie_casts movie_casts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_casts
    ADD CONSTRAINT movie_casts_pkey PRIMARY KEY (movie_id, actor_id);


--
-- Name: movie_directors movie_directors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_directors
    ADD CONSTRAINT movie_directors_pkey PRIMARY KEY (movie_id, director_id);


--
-- Name: movie_genres movie_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_pkey PRIMARY KEY (movie_id, genre_id);


--
-- Name: movie_producers movie_producers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_producers
    ADD CONSTRAINT movie_producers_pkey PRIMARY KEY (movie_id, producer_id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movie_id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (user_id);


--
-- Name: payment_method payment_method_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_pkey PRIMARY KEY (id);


--
-- Name: users phone_number; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT phone_number UNIQUE (phone_number);


--
-- Name: producers producers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.producers
    ADD CONSTRAINT producers_pkey PRIMARY KEY (producer_id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (promo_code);


--
-- Name: seats seats_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_pkey PRIMARY KEY (seat_id);


--
-- Name: show_seats show_seats_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.show_seats
    ADD CONSTRAINT show_seats_pkey PRIMARY KEY (show_seat_id);


--
-- Name: showrooms showrooms_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.showrooms
    ADD CONSTRAINT showrooms_pkey PRIMARY KEY (showroom_id);


--
-- Name: showtimes showtimes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.showtimes
    ADD CONSTRAINT showtimes_pkey PRIMARY KEY (show_id);


--
-- Name: theaters theaters_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.theaters
    ADD CONSTRAINT theaters_pkey PRIMARY KEY (theater_id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (ticket_number);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: idx_email_verifications_token; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_email_verifications_token ON public.email_verifications USING btree (token);


--
-- Name: admins admins_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: bookings bookings_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- Name: bookings bookings_promo_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_promo_code_fkey FOREIGN KEY (promo_code) REFERENCES public.promotions(promo_code);


--
-- Name: bookings bookings_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.showtimes(show_id);


--
-- Name: customer_favorite_movies customer_favorite_movies_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_favorite_movies
    ADD CONSTRAINT customer_favorite_movies_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- Name: customer_favorite_movies customer_favorite_movies_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_favorite_movies
    ADD CONSTRAINT customer_favorite_movies_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id) ON DELETE CASCADE;


--
-- Name: customer_genre_preferences customer_genre_preferences_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_genre_preferences
    ADD CONSTRAINT customer_genre_preferences_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- Name: customer_genre_preferences customer_genre_preferences_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_genre_preferences
    ADD CONSTRAINT customer_genre_preferences_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(genre_id);


--
-- Name: customers customers_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: email_verifications fk_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verifications
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: mailing_address mailing_address_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mailing_address
    ADD CONSTRAINT mailing_address_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- Name: movie_casts movie_casts_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_casts
    ADD CONSTRAINT movie_casts_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.actors(actor_id);


--
-- Name: movie_casts movie_casts_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_casts
    ADD CONSTRAINT movie_casts_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- Name: movie_directors movie_directors_director_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_directors
    ADD CONSTRAINT movie_directors_director_id_fkey FOREIGN KEY (director_id) REFERENCES public.directors(director_id);


--
-- Name: movie_directors movie_directors_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_directors
    ADD CONSTRAINT movie_directors_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- Name: movie_genres movie_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(genre_id);


--
-- Name: movie_genres movie_genres_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id) ON DELETE CASCADE;


--
-- Name: movie_producers movie_producers_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_producers
    ADD CONSTRAINT movie_producers_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- Name: movie_producers movie_producers_producer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movie_producers
    ADD CONSTRAINT movie_producers_producer_id_fkey FOREIGN KEY (producer_id) REFERENCES public.producers(producer_id);


--
-- Name: payment_method payment_method_billing_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_billing_address_id_fkey FOREIGN KEY (billing_address_id) REFERENCES public.mailing_address(id) ON DELETE SET NULL;


--
-- Name: payment_method payment_method_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_method
    ADD CONSTRAINT payment_method_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- Name: seats seats_showroom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_showroom_id_fkey FOREIGN KEY (showroom_id) REFERENCES public.showrooms(showroom_id);


--
-- Name: show_seats show_seats_seat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.show_seats
    ADD CONSTRAINT show_seats_seat_id_fkey FOREIGN KEY (seat_id) REFERENCES public.seats(seat_id);


--
-- Name: show_seats show_seats_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.show_seats
    ADD CONSTRAINT show_seats_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.showtimes(show_id);


--
-- Name: showrooms showrooms_theater_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.showrooms
    ADD CONSTRAINT showrooms_theater_id_fkey FOREIGN KEY (theater_id) REFERENCES public.theaters(theater_id);


--
-- Name: showtimes showtimes_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.showtimes
    ADD CONSTRAINT showtimes_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- Name: showtimes showtimes_showroom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.showtimes
    ADD CONSTRAINT showtimes_showroom_id_fkey FOREIGN KEY (showroom_id) REFERENCES public.showrooms(showroom_id);


--
-- Name: tickets tickets_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- Name: tickets tickets_show_seat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_show_seat_id_fkey FOREIGN KEY (show_seat_id) REFERENCES public.show_seats(show_seat_id);


--
-- Name: password_reset_tokens user_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT CREATE ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict o22b6eYgWAy79Q1i9jX6c9bVIhpejjE7FrfaxdNDZYfZbWp1dWwnOabJwhKhcai

