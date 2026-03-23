-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE customer_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE mpaa_rating AS ENUM ('G', 'PG', 'PG-13', 'R', 'NC-17');
CREATE TYPE ticket_type AS ENUM ('ADULT', 'SENIOR', 'CHILD');
CREATE TYPE user_type AS ENUM ('ADMIN', 'CUSTOMER');

-- ============================================================
-- USERS (shared table for login/auth)
-- ============================================================

CREATE TABLE users (
    user_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username         VARCHAR(50) UNIQUE NOT NULL,
    email            VARCHAR(200) NOT NULL UNIQUE,
    password         VARCHAR(200) NOT NULL,
    phone_number     VARCHAR(50),
    receives_promos  BOOLEAN DEFAULT FALSE,
    user_type        user_type NOT NULL
);

-- ============================================================
-- CUSTOMERS (customer-only data)
-- ============================================================

CREATE TABLE customers (
    customer_id UUID PRIMARY KEY,
    first_name  VARCHAR(100),
    last_name   VARCHAR(100),
    status      customer_status NOT NULL DEFAULT 'ACTIVE',

    FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

-- ============================================================
-- ADMINS (admin-only data)
-- ============================================================

CREATE TABLE admins (
    admin_id   UUID PRIMARY KEY,
    first_name VARCHAR(100),
    last_name  VARCHAR(100),

    FOREIGN KEY (admin_id) REFERENCES users(user_id)
);

-- ============================================================
-- PAYMENT CARDS (customers only)
-- ============================================================

CREATE TABLE payment_cards (
    card_id          SERIAL PRIMARY KEY,
    customer_id      UUID NOT NULL,
    card_num         VARCHAR(30) NOT NULL,
    expiry_date      VARCHAR(10) NOT NULL,
    billing_address  VARCHAR(200) NOT NULL,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- ============================================================
-- MAILING ADDRESSES (customers only)
-- ============================================================

CREATE TABLE mailing_addresses (
    address_id   SERIAL PRIMARY KEY,
    customer_id  UUID UNIQUE,
    address      VARCHAR(200) NOT NULL,
    zip_code     VARCHAR(20) NOT NULL,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- ============================================================
-- MOVIES + PEOPLE
-- ============================================================

CREATE TABLE movies (
    movie_id       SERIAL PRIMARY KEY,
    movie_name     VARCHAR(200) NOT NULL,
    category       VARCHAR(100),
    synopsis       TEXT,
    average_rating DOUBLE PRECISION,
    trailer        VARCHAR(300),
    trailer_image  VARCHAR(300),
    mpaa_us        mpaa_rating
);

CREATE TABLE actors (
    actor_id   SERIAL PRIMARY KEY,
    actor_name VARCHAR(200) NOT NULL
);

CREATE TABLE directors (
    director_id   SERIAL PRIMARY KEY,
    director_name VARCHAR(200) NOT NULL
);

CREATE TABLE producers (
    producer_id   SERIAL PRIMARY KEY,
    producer_name VARCHAR(200) NOT NULL
);

CREATE TABLE movie_casts (
    movie_id INT NOT NULL,
    actor_id INT NOT NULL,

    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (actor_id) REFERENCES actors(actor_id)
);

CREATE TABLE movie_directors (
    movie_id    INT NOT NULL,
    director_id INT NOT NULL,

    PRIMARY KEY (movie_id, director_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (director_id) REFERENCES directors(director_id)
);

CREATE TABLE movie_producers (
    movie_id    INT NOT NULL,
    producer_id INT NOT NULL,

    PRIMARY KEY (movie_id, producer_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (producer_id) REFERENCES producers(producer_id)
);

-- ============================================================
-- CUSTOMER FAVORITE MOVIES (customers only)
-- ============================================================

CREATE TABLE customer_favorite_movies (
    customer_id UUID NOT NULL,
    movie_id    INT NOT NULL,

    PRIMARY KEY (customer_id, movie_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- ============================================================
-- THEATERS / SHOWROOMS / SEATS
-- ============================================================

CREATE TABLE theaters (
    theater_id SERIAL PRIMARY KEY,
    name       VARCHAR(200) NOT NULL
);

CREATE TABLE showrooms (
    showroom_id  SERIAL PRIMARY KEY,
    theater_id   INT NOT NULL,
    showroom_num INT NOT NULL,
    number_seats INT NOT NULL,

    FOREIGN KEY (theater_id) REFERENCES theaters(theater_id)
);

CREATE TABLE seats (
    seat_id      SERIAL PRIMARY KEY,
    showroom_id  INT NOT NULL,
    seat_number  VARCHAR(10) NOT NULL,

    FOREIGN KEY (showroom_id) REFERENCES showrooms(showroom_id)
);

-- ============================================================
-- SHOWTIMES (UUID) / SHOW SEATS
-- ============================================================

CREATE TABLE showtimes (
    show_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    showroom_id  INT NOT NULL,
    movie_id     INT NOT NULL,
    date         TIMESTAMP NOT NULL,
    time         TIMESTAMP NOT NULL,
    duration     INT NOT NULL,

    FOREIGN KEY (showroom_id) REFERENCES showrooms(showroom_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

CREATE TABLE show_seats (
    show_seat_id SERIAL PRIMARY KEY,
    show_id      UUID NOT NULL,
    seat_id      INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (show_id) REFERENCES showtimes(show_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

-- ============================================================
-- PROMOTIONS
-- ============================================================

CREATE TABLE promotions (
    promo_code       VARCHAR(50) PRIMARY KEY,
    discount_amount  DOUBLE PRECISION NOT NULL
);

-- ============================================================
-- BOOKINGS (customers only)
-- ============================================================

CREATE TABLE bookings (
    booking_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id       UUID NOT NULL,
    show_id           UUID NOT NULL,
    booking_fee       DOUBLE PRECISION,
    total_price       DOUBLE PRECISION,
    payment_reference VARCHAR(100),
    promo_code        VARCHAR(50),

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (show_id) REFERENCES showtimes(show_id),
    FOREIGN KEY (promo_code) REFERENCES promotions(promo_code)
);

-- ============================================================
-- TICKETS
-- ============================================================

CREATE TABLE tickets (
    ticket_number UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id    UUID NOT NULL,
    show_seat_id  INT NOT NULL,
    type          ticket_type,
    price         DOUBLE PRECISION NOT NULL,

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (show_seat_id) REFERENCES show_seats(show_seat_id)
);