--
-- PostgreSQL database dump
--

\restrict Y4AOFQGnkoZqF9rbfYj6PvudAVu20FgayAh6uu9FYu2rwxNyTJBo76Q7texRqGf

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.1 (Debian 18.1-1.pgdg13+2)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: flight; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.flight (
    id integer NOT NULL,
    flight_name text,
    arrival_airport text,
    departure_airport text,
    arrival_time text,
    departure_time text,
    flight_logo text,
    fare numeric,
    country text
);


ALTER TABLE public.flight OWNER TO admin;

--
-- Name: flight_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.flight_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flight_id_seq OWNER TO admin;

--
-- Name: flight_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.flight_id_seq OWNED BY public.flight.id;


--
-- Name: flight id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.flight ALTER COLUMN id SET DEFAULT nextval('public.flight_id_seq'::regclass);


--
-- Data for Name: flight; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.flight (id, flight_name, arrival_airport, departure_airport, arrival_time, departure_time, flight_logo, fare, country) FROM stdin;
1	SpiceJet	Delhi International Airport	Chhatrapati Shivaji International Airport Mumbai	2026-01-15T08:55:00	2026-01-15T06:45:00	https://r-xx.bstatic.com/data/airlines_logo/SG.png	60	India
2	IndiGo	Delhi International Airport	Chhatrapati Shivaji International Airport Mumbai	2026-01-15T08:05:00	2026-01-15T06:05:00	https://r-xx.bstatic.com/data/airlines_logo/6E.png	65	India
3	IndiGo	Delhi International Airport	Chhatrapati Shivaji International Airport Mumbai	2026-01-15T21:15:00	2026-01-15T19:10:00	https://r-xx.bstatic.com/data/airlines_logo/6E.png	65	India
4	SpiceJet	Delhi International Airport	Chhatrapati Shivaji International Airport Mumbai	2026-01-15T09:40:00	2026-01-15T07:20:00	https://r-xx.bstatic.com/data/airlines_logo/SG.png	60	India
5	SpiceJet	Delhi International Airport	Chhatrapati Shivaji International Airport Mumbai	2026-01-16T01:25:00	2026-01-15T23:05:00	https://r-xx.bstatic.com/data/airlines_logo/SG.png	60	India
\.


--
-- Name: flight_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.flight_id_seq', 5, true);


--
-- Name: flight flight_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict Y4AOFQGnkoZqF9rbfYj6PvudAVu20FgayAh6uu9FYu2rwxNyTJBo76Q7texRqGf

