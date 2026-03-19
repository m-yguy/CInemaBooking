-- ============================================================
-- ENUM TYPES (MySQL ENUMs)
-- ============================================================

-- CustomerStatus: ACTIVE, INACTIVE, SUSPENDED
-- MpaRating: G, PG, PG-13, R, NC-17
-- TicketType: ADULT, SENIOR, CHILD

-- ============================================================
-- USER, ADMIN, CUSTOMER
-- ============================================================
CREATE TABLE UserTypes (
    UserTypeID INT PRIMARY KEY,
    UserTypeName VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO UserTypes (UserTypeID, UserTypeName) VALUES
(1, 'Admin'),
(2, 'Customer');

CREATE TABLE User (
    user_id            VARCHAR(50) PRIMARY KEY,
    email              VARCHAR(200) NOT NULL UNIQUE,
    password           VARCHAR(200) NOT NULL,
    phone_number       VARCHAR(50),
    receives_promos    BOOLEAN DEFAULT FALSE,
    user_type          ENUM('ADMIN','CUSTOMER') NOT NULL,
    -- UserTypeId INT NOT NULL,

    -- Customer-specific fields
    first_name         VARCHAR(100),
    last_name          VARCHAR(100),
    status             ENUM('ACTIVE','INACTIVE','SUSPENDED')

    -- FOREIGN KEY (UserTypeID) REFERENCES UserTypes(UserTypeID)

);

-- ============================================================
-- PAYMENT CARD (Customer 1 --> 0..3 PaymentCards)
-- ============================================================

CREATE TABLE PaymentCard (
    card_id        INT AUTO_INCREMENT PRIMARY KEY,
    customer_id    VARCHAR(50) NOT NULL,
    card_num       VARCHAR(30) NOT NULL,
    expiry_date    VARCHAR(10) NOT NULL,
    billing_address VARCHAR(200) NOT NULL,

    FOREIGN KEY (customer_id) REFERENCES User(user_id)
);

-- ============================================================
-- MAILING ADDRESS (Customer 1 --> 0..1 MailingAddress)
-- ============================================================

CREATE TABLE MailingAddress (
    address_id     INT AUTO_INCREMENT PRIMARY KEY,
    customer_id    VARCHAR(50) UNIQUE,
    address        VARCHAR(200) NOT NULL,
    zip_code       VARCHAR(20) NOT NULL,

    FOREIGN KEY (customer_id) REFERENCES User(user_id)
);

-- ============================================================
-- MOVIE
-- ============================================================


CREATE TABLE Movie (
    movie_id       INT AUTO_INCREMENT PRIMARY KEY,
    movie_name     VARCHAR(200) NOT NULL,
    category       VARCHAR(100),
    --cast           TEXT,  -- JSON or comma-separated
    --director       VARCHAR(100),
    --producer       VARCHAR(100),
    synopsis       TEXT,
    average_rating DOUBLE,
    trailer        VARCHAR(300),
    trailer_image  VARCHAR(300),
    mpaa_us        ENUM('G','PG','PG-13','R','NC-17')
);

CREATE TABLE Actor (
    actor_ud INT AUTO_INCREMENT PRIMARY KEY,
    actor_name VARCHAR(200) NOT NULL
)
CREATE TABLE Director (
    director_id   INT AUTO_INCREMENT PRIMARY KEY,
    director_name VARCHAR(200) NOT NULL
);
CREATE TABLE Producer (
    producer_id   INT AUTO_INCREMENT PRIMARY KEY,
    producer_name VARCHAR(200) NOT NULL
);


CREATE Table MovieCast (
    movie_id INT NOT NULL,
    actor_id INT NOT NULL,
    --role VARCHAR(150)
    
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id)
    FOREIGN KEY (actor_id) REFERENCES Actor(actor_id)
);
CREATE TABLE MovieDirector (
    movie_id    INT NOT NULL,
    director_id INT NOT NULL,

    PRIMARY KEY (movie_id, director_id),

    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id),
    FOREIGN KEY (director_id) REFERENCES Director(director_id)
);
CREATE TABLE MovieProducer (
    movie_id    INT NOT NULL,
    producer_id INT NOT NULL,

    PRIMARY KEY (movie_id, producer_id),

    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id),
    FOREIGN KEY (producer_id) REFERENCES Producer(producer_id)
);


-- ============================================================
-- CUSTOMER FAVORITE MOVIES (Join Table)
-- ============================================================

CREATE TABLE CustomerFavoriteMovie (
    customer_id   VARCHAR(50) NOT NULL,
    movie_id      INT NOT NULL,

    PRIMARY KEY (customer_id, movie_id),

    FOREIGN KEY (customer_id) REFERENCES User(user_id),
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id)
);

-- ============================================================
-- THEATER
-- ============================================================

CREATE TABLE Theater (
    theater_id   INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(200) NOT NULL
);

-- ============================================================
-- SHOWROOM (Theater 1 --> 1..*)
-- ============================================================

CREATE TABLE ShowRoom (
    showroom_id   INT AUTO_INCREMENT PRIMARY KEY,
    theater_id    INT NOT NULL,
    showroom_num  INT NOT NULL,
    number_seats  INT NOT NULL,

    FOREIGN KEY (theater_id) REFERENCES Theater(theater_id)
);

-- ============================================================
-- SEAT (ShowRoom 1 --> 1..*)
-- ============================================================

CREATE TABLE Seat (
    seat_id       INT AUTO_INCREMENT PRIMARY KEY,
    showroom_id   INT NOT NULL,
    seat_number   VARCHAR(10) NOT NULL,

    FOREIGN KEY (showroom_id) REFERENCES ShowRoom(showroom_id)
);

-- ============================================================
-- SHOW (ShowRoom 1 --> 0..*, Movie 1 <-- 0..*)
-- ============================================================

CREATE TABLE Show (
    show_id       VARCHAR(50) PRIMARY KEY,
    showroom_id   INT NOT NULL,
    movie_id      INT NOT NULL,
    date          DATETIME NOT NULL,
    time          DATETIME NOT NULL,
    duration      INT NOT NULL,

    FOREIGN KEY (showroom_id) REFERENCES ShowRoom(showroom_id),
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id)
);

-- ============================================================
-- SHOW SEAT (Seat availability per show)
-- ============================================================

CREATE TABLE ShowSeat (
    show_seat_id  INT AUTO_INCREMENT PRIMARY KEY,
    show_id       VARCHAR(50) NOT NULL,
    seat_id       INT NOT NULL,
    is_available  BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (show_id) REFERENCES Show(show_id),
    FOREIGN KEY (seat_id) REFERENCES Seat(seat_id)
);

-- ============================================================
-- PROMOTION
-- ============================================================

CREATE TABLE Promotion (
    promo_code       VARCHAR(50) PRIMARY KEY,
    discount_amount  DOUBLE NOT NULL
);

-- ============================================================
-- BOOKING (Customer 1 --> 0..*, Show 1 --> 1)
-- ============================================================

CREATE TABLE Booking (
    booking_id        VARCHAR(50) PRIMARY KEY,
    customer_id       VARCHAR(50) NOT NULL,
    show_id           VARCHAR(50) NOT NULL,
    booking_fee       DOUBLE,
    total_price       DOUBLE,
    payment_reference VARCHAR(100),
    promo_code        VARCHAR(50),

    FOREIGN KEY (customer_id) REFERENCES User(user_id),
    FOREIGN KEY (show_id) REFERENCES Show(show_id),
    FOREIGN KEY (promo_code) REFERENCES Promotion(promo_code)
);

-- ============================================================
-- TICKET (Booking 1 --> 1..*, Ticket 1 --> 1 ShowSeat)
-- ============================================================

CREATE TABLE Ticket (
    ticket_number   VARCHAR(50) PRIMARY KEY,
    booking_id      VARCHAR(50) NOT NULL,
    show_seat_id    INT NOT NULL,
    type            ENUM('ADULT','SENIOR','CHILD'),
    price           DOUBLE NOT NULL,

    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id),
    FOREIGN KEY (show_seat_id) REFERENCES ShowSeat(show_seat_id)
);