--
-- PostgreSQL database dump
--

\restrict SPyJ2OOSVhxAbiYSbJxiOQa40jnJWMXlRj6O4hmZ2txXhAH0sP87O7DlxqqUwXe

-- Dumped from database version 17.8 (a284a84)
-- Dumped by pg_dump version 18.3 (Ubuntu 18.3-1.pgdg24.04+1)

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
-- Name: mailing_addresses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mailing_addresses (
    address_id integer NOT NULL,
    customer_id uuid,
    address character varying(200) NOT NULL,
    zip_code character varying(20) NOT NULL
);


ALTER TABLE public.mailing_addresses OWNER TO neondb_owner;

--
-- Name: mailing_addresses_address_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mailing_addresses_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mailing_addresses_address_id_seq OWNER TO neondb_owner;

--
-- Name: mailing_addresses_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mailing_addresses_address_id_seq OWNED BY public.mailing_addresses.address_id;


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
-- Name: payment_cards; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payment_cards (
    card_id integer NOT NULL,
    customer_id uuid NOT NULL,
    card_num character varying(30) NOT NULL,
    expiry_date character varying(10) NOT NULL,
    billing_address character varying(200) NOT NULL
);


ALTER TABLE public.payment_cards OWNER TO neondb_owner;

--
-- Name: payment_cards_card_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.payment_cards_card_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_cards_card_id_seq OWNER TO neondb_owner;

--
-- Name: payment_cards_card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.payment_cards_card_id_seq OWNED BY public.payment_cards.card_id;


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
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(200) NOT NULL,
    password character varying(200) NOT NULL,
    phone_number character varying(50),
    receives_promos boolean DEFAULT false,
    user_type public.user_type NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: actors actor_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.actors ALTER COLUMN actor_id SET DEFAULT nextval('public.actors_actor_id_seq'::regclass);


--
-- Name: directors director_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.directors ALTER COLUMN director_id SET DEFAULT nextval('public.directors_director_id_seq'::regclass);


--
-- Name: mailing_addresses address_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mailing_addresses ALTER COLUMN address_id SET DEFAULT nextval('public.mailing_addresses_address_id_seq'::regclass);


--
-- Name: movies movie_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq'::regclass);


--
-- Name: payment_cards card_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_cards ALTER COLUMN card_id SET DEFAULT nextval('public.payment_cards_card_id_seq'::regclass);


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
a7f90616-24cd-46f5-95ff-ea6d3c9342b5	John	Smith
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
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customers (customer_id, first_name, last_name, status) FROM stdin;
d655606c-1192-4637-9266-35f21eb79f18	Jane	Smith	ACTIVE
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
-- Data for Name: mailing_addresses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mailing_addresses (address_id, customer_id, address, zip_code) FROM stdin;
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
-- Data for Name: payment_cards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payment_cards (card_id, customer_id, card_num, expiry_date, billing_address) FROM stdin;
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
\.


--
-- Data for Name: show_seats; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.show_seats (show_seat_id, show_id, seat_id, is_available) FROM stdin;
\.


--
-- Data for Name: showrooms; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.showrooms (showroom_id, theater_id, showroom_num, number_seats) FROM stdin;
\.


--
-- Data for Name: showtimes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.showtimes (show_id, showroom_id, movie_id, date, "time", duration) FROM stdin;
\.


--
-- Data for Name: theaters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.theaters (theater_id, name) FROM stdin;
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tickets (ticket_number, booking_id, show_seat_id, type, price) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (user_id, first_name, last_name, email, password, phone_number, receives_promos, user_type) FROM stdin;
d655606c-1192-4637-9266-35f21eb79f18	John	Doe	user@email.com	userpassword123	+44 7355244340	t	CUSTOMER
a7f90616-24cd-46f5-95ff-ea6d3c9342b5	Admin	User	admin@email.com	adminpassword123	+1 2836427310	f	ADMIN
\.


--
-- Name: actors_actor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.actors_actor_id_seq', 33, true);


--
-- Name: directors_director_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.directors_director_id_seq', 10, true);


--
-- Name: mailing_addresses_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mailing_addresses_address_id_seq', 1, false);


--
-- Name: movies_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.movies_movie_id_seq', 10, true);


--
-- Name: payment_cards_card_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.payment_cards_card_id_seq', 1, false);


--
-- Name: producers_producer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.producers_producer_id_seq', 28, true);


--
-- Name: seats_seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.seats_seat_id_seq', 1, false);


--
-- Name: show_seats_show_seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.show_seats_show_seat_id_seq', 1, false);


--
-- Name: showrooms_showroom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.showrooms_showroom_id_seq', 1, false);


--
-- Name: theaters_theater_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.theaters_theater_id_seq', 1, false);


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
-- Name: mailing_addresses mailing_addresses_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mailing_addresses
    ADD CONSTRAINT mailing_addresses_customer_id_key UNIQUE (customer_id);


--
-- Name: mailing_addresses mailing_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mailing_addresses
    ADD CONSTRAINT mailing_addresses_pkey PRIMARY KEY (address_id);


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
-- Name: payment_cards payment_cards_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_pkey PRIMARY KEY (card_id);


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
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

-- Username constraint removed; add unique constraint for (first_name, last_name, email) if needed
-- ALTER TABLE ONLY public.users
--     ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: admins admins_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(user_id);


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
    ADD CONSTRAINT customer_favorite_movies_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


--
-- Name: customer_favorite_movies customer_favorite_movies_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_favorite_movies
    ADD CONSTRAINT customer_favorite_movies_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id);


--
-- Name: customers customers_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(user_id);


--
-- Name: mailing_addresses mailing_addresses_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mailing_addresses
    ADD CONSTRAINT mailing_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


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
-- Name: payment_cards payment_cards_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_cards
    ADD CONSTRAINT payment_cards_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id);


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
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict SPyJ2OOSVhxAbiYSbJxiOQa40jnJWMXlRj6O4hmZ2txXhAH0sP87O7DlxqqUwXe

