--
-- PostgreSQL database dump
--

\restrict Y8YznJSc1mnzkayoBgIe1ILLfj74yhLjhggnF4XV9Ddup6vNdlH3JFtghb7foxR

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
-- Name: mpa_rating; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.mpa_rating AS ENUM (
    'G',
    'PG',
    'PG-13',
    'R'
);


ALTER TYPE public.mpa_rating OWNER TO neondb_owner;

--
-- Name: release_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.release_status AS ENUM (
    'Now Playing',
    'Coming Soon'
);


ALTER TYPE public.release_status OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: moviedata; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.moviedata (
    title character varying(50),
    genre character varying(50),
    rating numeric(2,1),
    movie_description text,
    poster_path character varying(150),
    showtime timestamp without time zone,
    trailer_link text,
    release_status public.release_status,
    mpa_rating public.mpa_rating,
    movie_cast text,
    director character varying(25),
    producer text,
    runtime integer
);


ALTER TABLE public.moviedata OWNER TO neondb_owner;

--
-- Data for Name: moviedata; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.moviedata (title, genre, rating, movie_description, poster_path, showtime, trailer_link, release_status, mpa_rating, movie_cast, director, producer, runtime) FROM stdin;
Iron Lung	Sci-fi/Horror	6.1	Survivors of the apocalypse send a convict in a small submarine to explore a desolate moon that's an ocean of blood.	/Movie_Posters/IronLung.jpg	2026-07-01 20:30:00	https://www.youtube.com/watch?v=i4sh-Dw4bzg	Now Playing	R	Markiplier, Caroline Kaplan, Troy Baker	Markiplier	Larissa Garcia-Baab, Jeff Guerrero, Will Hyde, Amy Nelson	127
Good Fortune	Comedy	7.8	A well-meaning but inept angel named Gabriel meddles in the lives of a struggling gig worker and a wealthy venture capitalist.	/Movie_Posters/GoodFortune.jpeg	2026-06-01 11:00:00	https://www.youtube.com/watch?v=ZKWndx83RwQ	Now Playing	R	Keanu Reeves, Aziz Ansari, Seth Rogen, Keke Palmer	Aziz Ansari	Anthony Katagas, Alan Yang, Aziz Ansari	99
28 Years Later	Horror/Thriller	8.8	It's been almost three decades since the rage virus escaped from a biological weapons laboratory. Still living in a ruthlessly enforced quarantine, some have found ways to exist amid the infected. One such group of survivors lives on a small island connected to the mainland by a single, heavily defended causeway. When one of them decides to venture into the dark heart of the mainland, he soon discovers a mutation that has spread to not only the infected, but other survivors as well.	/Movie_Posters/28YearsLater.jpg	2026-05-01 19:30:00	https://www.youtube.com/watch?v=IYGG55qwQZQ	Now Playing	R	Jodie Corner, Alfie Williams, Aaron Taylor-Johnson, Ralph Fiennes	Danny Boyle	Danny Boyle, Alex Garland, Andrew Macdonald	115
Marty Supreme	Drama/Sport	9.4	Marty Mauser, a wily hustler with a dream no one respects, goes to hell and back in pursuit of greatness.	/Movie_Posters/MartySupreme.jpg	2026-06-01 12:30:00	https://www.youtube.com/watch?v=s9gSuKaKcqM	Now Playing	PG-13	Timothee Chalamet, Gwyneth Paltrow, Odessa A'zion	Josh Safdie	Eli Bush, Timothee Chalamet, Ronald Bronstein	150
A Different Man	Drama/Thriller	6.9	An aspiring actor undergoes a radical medical procedure to drastically transform his appearance. However, his new dream face quickly turns into a nightmare as he becomes obsessed with reclaiming what was lost.	/Movie_Posters/ADifferentMan.jpg	2026-05-01 12:30:00	https://www.youtube.com/watch?v=_9CmC5Rmsdw	Coming Soon	R	Sebastian Stan, Renate Reinsve, Adam Pearson, Miles G. Jackson	Aaron Schimberg	Christine Vachon, Vanessa McDonnell, Pamela Koffler	112
Send Help	Comedy/Horror	9.4	A woman and her overbearing boss become stranded on a deserted island after a plane crash...	/Movie_Posters/SendHelp.jpg	2026-06-01 10:30:00	https://www.youtube.com/watch?v=R4wiXj9NmEE	Now Playing	PG-13	Rachel McAdams, Dylan O'Brien, Edyll Ismail	Sam Raimi	Sam Raimi, Zainab Azizi, Nicholas Simon	113
Goodboy	Horror	9.0	A man moves into a new home that has supernatural forces lurking in the shadows. As dark entities start to threaten him, his brave dog comes to the rescue.	/Movie_Posters/Goodboy.jpeg	2026-06-01 15:30:00	https://www.youtube.com/watch?v=q4-CRkd_74g	Now Playing	PG-13	Indy The Dog, Shane Jensen, Larry Fessenden	Ben Leonberg	Kari Fischer, Ben Leonberg, Brian Goodheart	73
Strangers Chapter 3	Horror	2.0	Curious about rumors of mannequins coming to life at night in a local store...	/Movie_Posters/StrangersChapter3.jpg	2026-06-01 15:30:00	https://www.youtube.com/watch?v=yyAALuRTQ_w	Coming Soon	PG-13	Madelaine Petsch, Richard Brake, Ema Horvath	Renny Harlin	Courtney Solomon	91
Scarface	Action/Crime	7.8	After getting a green card in exchange for assassinating a Cuban government official, Tony Montana stakes a claim on the drug trade in Miami...	/Movie_Posters/Scarface.jpg	2026-06-01 10:30:00	https://www.youtube.com/watch?v=7pQQHnqBa2E	Now Playing	R	Al Pacino, Steven Bauer, Michelle Pfeiffer	Brian De Palma	Martin Bregman, Peter Saphier	170
Eddington	Western/Thriller/Drama	6.8	During the COVID-19 pandemic, a standoff between a small-town sheriff and mayor sparks a powder keg as neighbour is pitted against neighbour in Eddington, N.M.	/Movie_Posters/Eddington.jpeg	2026-05-01 14:30:00	https://www.youtube.com/watch?v=oL6jZqExlIk	Coming Soon	R	Joaquin Pheonix, Deirdre O'Connell, Emma Stone	Ari Aster	Lars Knudsen, Ari Aster, Ann Ruark	150
\.


--
-- Name: moviedata moviedata_title_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.moviedata
    ADD CONSTRAINT moviedata_title_key UNIQUE (title);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict Y8YznJSc1mnzkayoBgIe1ILLfj74yhLjhggnF4XV9Ddup6vNdlH3JFtghb7foxR

