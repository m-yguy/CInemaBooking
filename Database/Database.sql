-- hello this is the database main sql file guys!
CREATE DATABASE IF NOT EXISTS Cinema;
USE Cinema;

CREATE TABLE IF NOT EXISTS movieData(
    title VARCHAR(50) UNIQUE,
    genre VARCHAR(50),
    rating DECIMAL(2,1),
    movie_description TEXT,
    poster_path VARCHAR(150),
    showtimes DATETIME,
    trailer_link TEXT,
    release_status ENUM("Now Playing", "Coming Soon"),
    mpa_rating ENUM("G", "PG", "PG-13", "R")
    cast TEXT,
    Director VARCHAR(25),
    Producer TEXT
);

INSERT INTO movieData
VALUES
    (
        "28 Years Later", 
        "Horror/Thriller",
        8.8,
        "It's been almost three decades since the rage virus escaped from a biological weapons laboratory. Still living in a ruthlessly enforced quarantine, some have found ways to exist amid the infected. One such group of survivors lives on a small island connected to the mainland by a single, heavily defended causeway. When one of them decides to venture into the dark heart of the mainland, he soon discovers a mutation that has spread to not only the infected, but other survivors as well.",
        "Database/Movie_Posters/28YearsLater.jpg",
        "2026-05-01 19:30:00",
        "https://www.youtube.com/watch?v=IYGG55qwQZQ"
        "Now Playing",
        "R",
        "Jodie Corner, Alfie Williams, Aaron Taylor-Johnson, Ralph Fiennes"
        "Danny Boyle",
        "Danny Boyle, Alex Garland, Andrew Macdonald"

    ),
    (
        "A Different Man",
        "Thriller/Drama",
        6.9,
        "An aspiring actor undergoes a radical medical procedure to drastically transform his appearance. However, his new dream face quickly turns into a nightmare as he becomes obsessed with reclaiming what was lost.",
        "Database/Movie_Posters/ADifferentMan.jpg",
        "2026-05-01 12:30:00",
        "https://www.youtube.com/watch?v=_9CmC5Rmsdw"
        "Coming Soon",
        "R",
        "Sebastian Stan, Renate Reinsve, Adam Pearson, Miles G. Jackson"
        "Aaron Schimberg",
        "Christine Vachon, Vanessa McDonnell, Pamela Koffler"
    ),
    (
        "Eddington",
        "Western/Thriller",
        6.8,
        "During the COVID-19 pandemic, a standoff between a small-town sheriff and mayor sparks a powder keg as neighbour is pitted against neighbour in Eddington, N.M.",
        "Database/Movie_Posters/Eddington.jpeg",
        "2026-05-01 14:30:00",
        "https://www.youtube.com/watch?v=oL6jZqExlIk"
        "Coming Soon",
        "R",
        "Joaquin Pheonix, Deirdre O'Connell, Emma Stone"
        "Ari Aster",
        "Lars Knudsen, Ari Aster, Ann Ruark"
    ),
    (
        "Goodboy",
        "Horror",
        9.0,
        "A man moves into a new home that has supernatural forces lurking in the shadows. As dark entities start to threaten him, his brave dog comes to the rescue.",
        "Database/Movie_Posters/Goodboy.jpeg",
        "2026-06-01 15:30:00",
        "https://www.youtube.com/watch?v=q4-CRkd_74g"
        "Now Playing",
        "PG-13",
        "Indy The Dog, Shane Jensen, Larry Fessenden"
        "Ben Leonberg",
        "Kari Fischer, Ben Leonberg, Brian Goodheart"
    ),
    (
        "Good Fortune",
        "Comedy",
        7.8,
        "A well-meaning but inept angel named Gabriel meddles in the lives of a struggling gig worker and a wealthy venture capitalist.",
        "Database/Movie_Posters/GoodFortune.jpeg",
        "2026-06-01 11:00:00",
        "https://www.youtube.com/watch?v=ZKWndx83RwQ"
        "Now Playing",
        "R",
        "Keanu Reeves, Aziz Ansari, Seth Rogen, Keke Palmer"
        "Aziz Ansari",
        "Anthony Katagas, Alan Yang, Aziz Ansari"
    ),
    (
        "Iron Lung",
        "Horror/Sci-fi",
        6.1,
        "Survivors of the apocalypse send a convict in a small submarine to explore a desolate moon that's an ocean of blood.",
        "Database/Movie_Posters/IronLung.jpg",
        "2026-07-01 20:30:00",
        "https://www.youtube.com/watch?v=i4sh-Dw4bzg"
        "Now Playing",
        "R",
        "Markiplier, Caroline Kaplan, Troy Baker"
        "Markiplier",
        "Larissa Garcia-Baab, Jeff Guerrero, Will Hyde, Amy Nelson"
    ),
    (
        "Marty Supreme",
        "Sport/Drama",
        9.4,
        "Marty Mauser, a wily hustler with a dream no one respects, goes to hell and back in pursuit of greatness.",
        "Database/Movie_Posters/MartySupreme.jpg",
        "2026-06-01 12:30:00",
        "https://www.youtube.com/watch?v=s9gSuKaKcqM"
    ),
    (
        "Scareface",
        "Crime/Action",
        7.8,
        "After getting a green card in exchange for assassinating a Cuban government official, Tony Montana stakes a claim on the drug trade in Miami...",
        "Database/Movie_Posters/Scarface.jpg",
        "2026-06-01 10:30:00",
        "https://www.youtube.com/watch?v=7pQQHnqBa2E"
        "Now Playing",
        "PG-13",
        "Timothee Chalamet, GWyneth Paltrow, Odessa A'zion"
        "Josh Safdie",
        "Eli Bush, Timothee Chalamet, Ronald Bronstein"
    ),
    (
        "Send Help",
        "Horror/Comedy",
        9.4,
        "A woman and her overbearing boss become stranded on a deserted island after a plane crash...",
        "Database/Movie_Posters/SendHelp.jpg",
        "2026-06-01 10:30:00",
        "https://www.youtube.com/watch?v=R4wiXj9NmEE"
        "Now Playing",
        "PG-13",
        "Rachel McAdams, Dylan O'Brien, Edyll Ismail"
        "Sam Raimi",
        "Sam Raimi, Zainab Azizi, Nicholas Simon"
    ),
    (
        "Strangers Chapter 3",
        "Horror/Suspense",
        2.0,
        "Curious about rumors of mannequins coming to life at night in a local store...",
        "Database/Movie_Posters/StrangersChapter3.jpg",
        "2026-06-01 15:30:00",
        "https://www.youtube.com/watch?v=yyAALuRTQ_w"
        "Coming Soon",
        "PG-13",
        "Rachel McAdams, Dylan O'Brien, Edyll Ismail"
        "Sam Raimi",
        "Sam Raimi, Zainab Azizi, Nicholas Simon"
    );
