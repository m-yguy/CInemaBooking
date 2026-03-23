--
-- PostgreSQL database dump
--

\restrict tavqMCJpnGZriNgAuDKF4ZQQ5DdZF0YRHUwlNjQuJhjyBZlYeBOJLmUbSdALKUt

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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (user_id, username, email, password, phone_number, receives_promos, user_type) FROM stdin;
d655606c-1192-4637-9266-35f21eb79f18	user1	user@email.com	userpassword123	+44 7355244340	t	CUSTOMER
a7f90616-24cd-46f5-95ff-ea6d3c9342b5	admin1	admin@email.com	adminpassword123	+1 2836427310	f	ADMIN
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.admins (admin_id, first_name, last_name) FROM stdin;
a7f90616-24cd-46f5-95ff-ea6d3c9342b5	John	Smith
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customers (customer_id, first_name, last_name, status) FROM stdin;
d655606c-1192-4637-9266-35f21eb79f18	Jane	Smith	ACTIVE
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.movies (movie_id, movie_name, category, synopsis, average_rating, trailer, trailer_image, mpaa_us) FROM stdin;
1	Iron Lung	Sci-fi/Horror	Survivors of the apocalypse send a convict in a small submarine to explore a desolate moon that's an ocean of blood.	6.1	https://www.youtube.com/watch?v=i4sh-Dw4bzg	/Movie_Posters/IronLung.jpg	R
2	Good Fortune	Comedy	A well-meaning but inept angel named Gabriel meddles in the lives of a struggling gig worker and a wealthy venture capitalist.	7.8	https://www.youtube.com/watch?v=ZKWndx83RwQ	/Movie_Posters/GoodFortune.jpeg	R
3	28 Years Later	Horror/Thriller	It's been almost three decades since the rage virus escaped from a biological weapons laboratory...	8.8	https://www.youtube.com/watch?v=IYGG55qwQZQ	/Movie_Posters/28YearsLater.jpg	R
4	Marty Supreme	Drama/Sport	Marty Mauser, a wily hustler with a dream no one respects, goes to hell and back in pursuit of greatness.	9.4	https://www.youtube.com/watch?v=s9gSuKaKcqM	/Movie_Posters/MartySupreme.jpg	PG-13
5	A Different Man	Drama/Thriller	An aspiring actor undergoes a radical medical procedure to drastically transform his appearance...	6.9	https://www.youtube.com/watch?v=_9CmC5Rmsdw	/Movie_Posters/ADifferentMan.jpg	R
6	Send Help	Comedy/Horror	A woman and her overbearing boss become stranded on a deserted island after a plane crash...	9.4	https://www.youtube.com/watch?v=R4wiXj9NmEE	/Movie_Posters/SendHelp.jpg	PG-13
7	Goodboy	Horror	A man moves into a new home that has supernatural forces lurking in the shadows...	9	https://www.youtube.com/watch?v=q4-CRkd_74g	/Movie_Posters/Goodboy.jpeg	PG-13
8	Strangers Chapter 3	Horror	Curious about rumors of mannequins coming to life at night in a local store...	2	https://www.youtube.com/watch?v=yyAALuRTQ_w	/Movie_Posters/StrangersChapter3.jpg	PG-13
9	Scarface	Action/Crime	After getting a green card in exchange for assassinating a Cuban government official...	7.8	https://www.youtube.com/watch?v=7pQQHnqBa2E	/Movie_Posters/Scarface.jpg	R
10	Eddington	Western/Thriller/Drama	During the COVID-19 pandemic, a standoff between a small-town sheriff and mayor sparks a powder keg...	6.8	https://www.youtube.com/watch?v=oL6jZqExlIk	/Movie_Posters/Eddington.jpeg	R
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.promotions (promo_code, discount_amount) FROM stdin;
\.


--
-- Data for Name: theaters; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.theaters (theater_id, name) FROM stdin;
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
-- Data for Name: payment_cards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payment_cards (card_id, customer_id, card_num, expiry_date, billing_address) FROM stdin;
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
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.tickets (ticket_number, booking_id, show_seat_id, type, price) FROM stdin;
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
-- PostgreSQL database dump complete
--

\unrestrict tavqMCJpnGZriNgAuDKF4ZQQ5DdZF0YRHUwlNjQuJhjyBZlYeBOJLmUbSdALKUt

