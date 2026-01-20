require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const User = require('../models/User');

// IMDb Top 250 Movies Data (Sample of 50 movies)
const moviesData = [
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseYear: 1994,
    rating: 9.3,
    duration: 142,
    genre: ["Drama"],
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    imdbId: "tt0111161",
    imdbRank: 1
  },
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.",
    releaseYear: 1972,
    rating: 9.2,
    duration: 175,
    genre: ["Crime", "Drama"],
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0068646",
    imdbRank: 2
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseYear: 2008,
    rating: 9.0,
    duration: 152,
    genre: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    imdbId: "tt0468569",
    imdbRank: 3
  },
  {
    title: "The Godfather Part II",
    description: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    releaseYear: 1974,
    rating: 9.0,
    duration: 202,
    genre: ["Crime", "Drama"],
    director: "Francis Ford Coppola",
    cast: ["Al Pacino", "Robert De Niro", "Robert Duvall"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0071562",
    imdbRank: 4
  },
  {
    title: "12 Angry Men",
    description: "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before voting.",
    releaseYear: 1957,
    rating: 9.0,
    duration: 96,
    genre: ["Crime", "Drama"],
    director: "Sidney Lumet",
    cast: ["Henry Fonda", "Lee J. Cobb", "Martin Balsam"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMWU4N2FjNzYtNTVkNC00NzQ0LTg0MjAtYTJlMjFhNGUxZDFmXkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_.jpg",
    imdbId: "tt0050083",
    imdbRank: 5
  },
  {
    title: "Schindler's List",
    description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    releaseYear: 1993,
    rating: 9.0,
    duration: 195,
    genre: ["Biography", "Drama", "History"],
    director: "Steven Spielberg",
    cast: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0108052",
    imdbRank: 6
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    releaseYear: 2003,
    rating: 9.0,
    duration: 201,
    genre: ["Action", "Adventure", "Drama"],
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0167260",
    imdbRank: 7
  },
  {
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    rating: 8.9,
    duration: 154,
    genre: ["Crime", "Drama"],
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0110912",
    imdbRank: 8
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    releaseYear: 2001,
    rating: 8.8,
    duration: 178,
    genre: ["Action", "Adventure", "Drama"],
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg",
    imdbId: "tt0120737",
    imdbRank: 9
  },
  {
    title: "Fight Club",
    description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    releaseYear: 1999,
    rating: 8.8,
    duration: 139,
    genre: ["Drama"],
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLWE2YTktZTBhNTBjYTY5OWJlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0137523",
    imdbRank: 10
  },
  {
    title: "Forrest Gump",
    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    releaseYear: 1994,
    rating: 8.8,
    duration: 142,
    genre: ["Drama", "Romance"],
    director: "Robert Zemeckis",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    imdbId: "tt0109830",
    imdbRank: 11
  },
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    rating: 8.8,
    duration: 148,
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    imdbId: "tt1375666",
    imdbRank: 12
  },
  {
    title: "The Lord of the Rings: The Two Towers",
    description: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
    releaseYear: 2002,
    rating: 8.8,
    duration: 179,
    genre: ["Action", "Adventure", "Drama"],
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZGMxZTdjZmYtMmE2Ni00ZTdkLWI5NTgtNjlmMjBiNzU2MmI5XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0167261",
    imdbRank: 13
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    description: "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued by Darth Vader.",
    releaseYear: 1980,
    rating: 8.7,
    duration: 124,
    genre: ["Action", "Adventure", "Fantasy"],
    director: "Irvin Kershner",
    cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0080684",
    imdbRank: 14
  },
  {
    title: "The Matrix",
    description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    releaseYear: 1999,
    rating: 8.7,
    duration: 136,
    genre: ["Action", "Sci-Fi"],
    director: "Lana Wachowski, Lilly Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0133093",
    imdbRank: 15
  },
  {
    title: "Goodfellas",
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    releaseYear: 1990,
    rating: 8.7,
    duration: 145,
    genre: ["Biography", "Crime", "Drama"],
    director: "Martin Scorsese",
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0099685",
    imdbRank: 16
  },
  {
    title: "One Flew Over the Cuckoo's Nest",
    description: "In the Fall of 1963, a Korean War veteran and target of multiple petty criminal charges attempts to escape corrective custody by feigning insanity.",
    releaseYear: 1975,
    rating: 8.7,
    duration: 133,
    genre: ["Drama"],
    director: "Milos Forman",
    cast: ["Jack Nicholson", "Louise Fletcher", "Michael Berryman"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjA0OWVhOTAtYWQxNi00YzNhLWI4ZjYtNjFjZTEyYjJlNDVlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    imdbId: "tt0073486",
    imdbRank: 17
  },
  {
    title: "Se7en",
    description: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    releaseYear: 1995,
    rating: 8.6,
    duration: 127,
    genre: ["Crime", "Drama", "Mystery"],
    director: "David Fincher",
    cast: ["Morgan Freeman", "Brad Pitt", "Kevin Spacey"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0114369",
    imdbRank: 18
  },
  {
    title: "It's a Wonderful Life",
    description: "An angel is sent from Heaven to help a desperately frustrated businessman by showing him what life would have been like if he had never existed.",
    releaseYear: 1946,
    rating: 8.6,
    duration: 130,
    genre: ["Drama", "Family", "Fantasy"],
    director: "Frank Capra",
    cast: ["James Stewart", "Donna Reed", "Lionel Barrymore"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjc4NDZhZWMtNGEzYS00ZWU2LThlM2ItNTA0YzQ0OTExMTE2XkEyXkFqcGdeQXVyNjUwMzI2NzU@._V1_.jpg",
    imdbId: "tt0038650",
    imdbRank: 19
  },
  {
    title: "The Silence of the Lambs",
    description: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
    releaseYear: 1991,
    rating: 8.6,
    duration: 118,
    genre: ["Crime", "Drama", "Thriller"],
    director: "Jonathan Demme",
    cast: ["Jodie Foster", "Anthony Hopkins", "Lawrence A. Bonney"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0102926",
    imdbRank: 20
  },
  {
    title: "Saving Private Ryan",
    description: "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.",
    releaseYear: 1998,
    rating: 8.6,
    duration: 169,
    genre: ["Drama", "War"],
    director: "Steven Spielberg",
    cast: ["Tom Hanks", "Matt Damon", "Tom Sizemore"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjhkMDM4MWItZTVjOC00ZDRhLThmYTAtM2I5NzBmNmNlMzI1XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_.jpg",
    imdbId: "tt0120815",
    imdbRank: 21
  },
  {
    title: "City of God",
    description: "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other a kingpin.",
    releaseYear: 2002,
    rating: 8.6,
    duration: 130,
    genre: ["Crime", "Drama"],
    director: "Fernando Meirelles, Kátia Lund",
    cast: ["Alexandre Rodrigues", "Leandro Firmino", "Matheus Nachtergaele"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOTMwYjc5ZmItYTFjZC00ZGQ3LTlkNTMtMjZiNTZlMWQzNzI5XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0317248",
    imdbRank: 22
  },
  {
    title: "The Green Mile",
    description: "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.",
    releaseYear: 1999,
    rating: 8.6,
    duration: 189,
    genre: ["Crime", "Drama", "Fantasy"],
    director: "Frank Darabont",
    cast: ["Tom Hanks", "Michael Clarke Duncan", "David Morse"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_.jpg",
    imdbId: "tt0120689",
    imdbRank: 23
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    rating: 8.6,
    duration: 169,
    genre: ["Adventure", "Drama", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    imdbId: "tt0816692",
    imdbRank: 24
  },
  {
    title: "Star Wars: Episode IV - A New Hope",
    description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.",
    releaseYear: 1977,
    rating: 8.6,
    duration: 121,
    genre: ["Action", "Adventure", "Fantasy"],
    director: "George Lucas",
    cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_.jpg",
    imdbId: "tt0076759",
    imdbRank: 25
  },
  {
    title: "Terminator 2: Judgment Day",
    description: "A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her ten-year-old son John from a more advanced and powerful cyborg.",
    releaseYear: 1991,
    rating: 8.6,
    duration: 137,
    genre: ["Action", "Sci-Fi"],
    director: "James Cameron",
    cast: ["Arnold Schwarzenegger", "Linda Hamilton", "Edward Furlong"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMGU2NzRmZjUtOGUxYS00ZjdjLWEwZWItY2NlM2JhNjkxNTFmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0103064",
    imdbRank: 26
  },
  {
    title: "Back to the Future",
    description: "Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his close friend, the maverick scientist Doc Brown.",
    releaseYear: 1985,
    rating: 8.5,
    duration: 116,
    genre: ["Adventure", "Comedy", "Sci-Fi"],
    director: "Robert Zemeckis",
    cast: ["Michael J. Fox", "Christopher Lloyd", "Lea Thompson"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    imdbId: "tt0088763",
    imdbRank: 27
  },
  {
    title: "Spirited Away",
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    releaseYear: 2001,
    rating: 8.6,
    duration: 125,
    genre: ["Animation", "Adventure", "Family"],
    director: "Hayao Miyazaki",
    cast: ["Daveigh Chase", "Suzanne Pleshette", "Miyu Irino"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    imdbId: "tt0245429",
    imdbRank: 28
  },
  {
    title: "The Pianist",
    description: "A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II.",
    releaseYear: 2002,
    rating: 8.5,
    duration: 150,
    genre: ["Biography", "Drama", "Music"],
    director: "Roman Polanski",
    cast: ["Adrien Brody", "Thomas Kretschmann", "Frank Finlay"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOWRiZDIxZjktMTA1NC00MDQ2LWEzMjUtMTliZmY3NjQ3ODJiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0253474",
    imdbRank: 29
  },
  {
    title: "Psycho",
    description: "A Phoenix secretary embezzles $40,000 from her employer's client, goes on the run and checks into a remote motel run by a young man under the domination of his mother.",
    releaseYear: 1960,
    rating: 8.5,
    duration: 109,
    genre: ["Horror", "Mystery", "Thriller"],
    director: "Alfred Hitchcock",
    cast: ["Anthony Perkins", "Janet Leigh", "Vera Miles"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNTQwNDM1YzItNDAxZC00NWY2LTk0M2UtNDIwNWI5OGUyNWUxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0054215",
    imdbRank: 30
  },
  {
    title: "Parasite",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    releaseYear: 2019,
    rating: 8.5,
    duration: 132,
    genre: ["Drama", "Thriller"],
    director: "Bong Joon Ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
    imdbId: "tt6751668",
    imdbRank: 31
  },
  {
    title: "Léon: The Professional",
    description: "12-year-old Mathilda is reluctantly taken in by Léon, a professional assassin, after her family is murdered. An unusual relationship forms as she becomes his protégée.",
    releaseYear: 1994,
    rating: 8.5,
    duration: 110,
    genre: ["Action", "Crime", "Drama"],
    director: "Luc Besson",
    cast: ["Jean Reno", "Gary Oldman", "Natalie Portman"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BODllNWE0MmEtYjUwZi00ZjY3LThmNmQtZjZlMjI2YTZjYmQ0XkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_.jpg",
    imdbId: "tt0110413",
    imdbRank: 32
  },
  {
    title: "The Lion King",
    description: "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.",
    releaseYear: 1994,
    rating: 8.5,
    duration: 88,
    genre: ["Animation", "Adventure", "Drama"],
    director: "Roger Allers, Rob Minkoff",
    cast: ["Matthew Broderick", "Jeremy Irons", "James Earl Jones"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_.jpg",
    imdbId: "tt0110357",
    imdbRank: 33
  },
  {
    title: "Gladiator",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    releaseYear: 2000,
    rating: 8.5,
    duration: 155,
    genre: ["Action", "Adventure", "Drama"],
    director: "Ridley Scott",
    cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0172495",
    imdbRank: 34
  },
  {
    title: "American History X",
    description: "A former neo-nazi skinhead tries to prevent his younger brother from going down the same wrong path that he did.",
    releaseYear: 1998,
    rating: 8.5,
    duration: 119,
    genre: ["Crime", "Drama"],
    director: "Tony Kaye",
    cast: ["Edward Norton", "Edward Furlong", "Beverly D'Angelo"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZTJhN2FkYWEtMGI0My00YWM4LWI2MjAtM2UwNjY4MTI2ZTQyXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_.jpg",
    imdbId: "tt0120586",
    imdbRank: 35
  },
  {
    title: "The Departed",
    description: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.",
    releaseYear: 2006,
    rating: 8.5,
    duration: 151,
    genre: ["Crime", "Drama", "Thriller"],
    director: "Martin Scorsese",
    cast: ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_.jpg",
    imdbId: "tt0407887",
    imdbRank: 36
  },
  {
    title: "The Prestige",
    description: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
    releaseYear: 2006,
    rating: 8.5,
    duration: 130,
    genre: ["Drama", "Mystery", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Hugh Jackman", "Scarlett Johansson"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_.jpg",
    imdbId: "tt0482571",
    imdbRank: 37
  },
  {
    title: "The Usual Suspects",
    description: "A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met at a seemingly random police lineup.",
    releaseYear: 1995,
    rating: 8.5,
    duration: 106,
    genre: ["Crime", "Drama", "Mystery"],
    director: "Bryan Singer",
    cast: ["Kevin Spacey", "Gabriel Byrne", "Chazz Palminteri"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYTViNjMyNmUtNDFkNC00ZDRlLThmMDUtZDU2YWE4NGI2ZjVmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0114814",
    imdbRank: 38
  },
  {
    title: "Casablanca",
    description: "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.",
    releaseYear: 1942,
    rating: 8.5,
    duration: 102,
    genre: ["Drama", "Romance", "War"],
    director: "Michael Curtiz",
    cast: ["Humphrey Bogart", "Ingrid Bergman", "Paul Henreid"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BY2IzZGY2YmEtYzljNS00NTM5LTgwMzUtMzM1NjQ4NGI0OTk0XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_.jpg",
    imdbId: "tt0034583",
    imdbRank: 39
  },
  {
    title: "Whiplash",
    description: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    releaseYear: 2014,
    rating: 8.5,
    duration: 106,
    genre: ["Drama", "Music"],
    director: "Damien Chazelle",
    cast: ["Miles Teller", "J.K. Simmons", "Melissa Benoist"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    imdbId: "tt2582802",
    imdbRank: 40
  },
  {
    title: "Grave of the Fireflies",
    description: "A young boy and his little sister struggle to survive in Japan during World War II.",
    releaseYear: 1988,
    rating: 8.5,
    duration: 89,
    genre: ["Animation", "Drama", "War"],
    director: "Isao Takahata",
    cast: ["Tsutomu Tatsumi", "Ayano Shiraishi", "Akemi Yamaguchi"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZmY2NjUzNDQtNTgxNC00M2Q4LTljOWQtMjNjNDBjNWUxNmJlXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
    imdbId: "tt0095327",
    imdbRank: 41
  },
  {
    title: "The Intouchables",
    description: "After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.",
    releaseYear: 2011,
    rating: 8.5,
    duration: 112,
    genre: ["Biography", "Comedy", "Drama"],
    director: "Olivier Nakache, Éric Toledano",
    cast: ["François Cluzet", "Omar Sy", "Anne Le Ny"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_.jpg",
    imdbId: "tt1675434",
    imdbRank: 42
  },
  {
    title: "Modern Times",
    description: "The Tramp struggles to live in modern industrial society with the help of a young homeless woman.",
    releaseYear: 1936,
    rating: 8.5,
    duration: 87,
    genre: ["Comedy", "Drama", "Romance"],
    director: "Charles Chaplin",
    cast: ["Charles Chaplin", "Paulette Goddard", "Henry Bergman"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYjJiZjMzYzktNjU0NS00OTkxLWEwYzItYzdhYWJjN2QzMTRlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0027977",
    imdbRank: 43
  },
  {
    title: "Once Upon a Time in the West",
    description: "A mysterious stranger with a harmonica joins forces with a notorious desperado to protect a beautiful widow from a ruthless assassin working for the railroad.",
    releaseYear: 1968,
    rating: 8.5,
    duration: 165,
    genre: ["Western"],
    director: "Sergio Leone",
    cast: ["Henry Fonda", "Charles Bronson", "Claudia Cardinale"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BODQ3NDExOGYtMzI3Mi00NWRlLTkwNjAtNjc4MDgzZGJiZTA1XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg",
    imdbId: "tt0064116",
    imdbRank: 44
  },
  {
    title: "Alien",
    description: "After a space merchant vessel receives an unknown transmission as a distress call, one of the crew is attacked by a mysterious life form and they soon realize that its life cycle has merely begun.",
    releaseYear: 1979,
    rating: 8.5,
    duration: 117,
    genre: ["Horror", "Sci-Fi"],
    director: "Ridley Scott",
    cast: ["Sigourney Weaver", "Tom Skerritt", "John Hurt"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOGQzZTBjMjQtOTVmMS00NGE5LWEyYmMtOGQ1ZGZjNmRkYjFhXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg",
    imdbId: "tt0078748",
    imdbRank: 45
  },
  {
    title: "Rear Window",
    description: "A wheelchair-bound photographer spies on his neighbors from his Greenwich Village apartment window, and becomes convinced one of them has committed murder.",
    releaseYear: 1954,
    rating: 8.5,
    duration: 112,
    genre: ["Mystery", "Thriller"],
    director: "Alfred Hitchcock",
    cast: ["James Stewart", "Grace Kelly", "Wendell Corey"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNGUxYWM3M2MtMGM3Mi00ZmRiLWE0NGQtZjE5ODI2OTJhNTU0XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
    imdbId: "tt0047396",
    imdbRank: 46
  },
  {
    title: "City Lights",
    description: "With the aid of a wealthy erratic tippler, a tramp who has fallen in love with a blind flower girl accumulates money to be able to help her with an operation that can restore her sight.",
    releaseYear: 1931,
    rating: 8.5,
    duration: 87,
    genre: ["Comedy", "Drama", "Romance"],
    director: "Charles Chaplin",
    cast: ["Charles Chaplin", "Virginia Cherrill", "Florence Lee"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BY2I4MmM1N2EtM2YzOS00OWUzLTkzYzctNDc5NDg2N2IyODJmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    imdbId: "tt0021749",
    imdbRank: 47
  },
  {
    title: "Apocalypse Now",
    description: "A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel who sees himself as a god.",
    releaseYear: 1979,
    rating: 8.4,
    duration: 147,
    genre: ["Drama", "Mystery", "War"],
    director: "Francis Ford Coppola",
    cast: ["Martin Sheen", "Marlon Brando", "Robert Duvall"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYmQyNTA1ZGItNjZjMi00NzFlLWEzMWEtNWMwN2Q2MjJhYzEyXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg",
    imdbId: "tt0078788",
    imdbRank: 48
  },
  {
    title: "Memento",
    description: "A man with short-term memory loss attempts to track down his wife's murderer.",
    releaseYear: 2000,
    rating: 8.4,
    duration: 113,
    genre: ["Mystery", "Thriller"],
    director: "Christopher Nolan",
    cast: ["Guy Pearce", "Carrie-Anne Moss", "Joe Pantoliano"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZTcyNjk1MjgtOWI3Mi00YzQwLWI5MTktMzY4ZmI2NDAyNzYzXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    imdbId: "tt0209144",
    imdbRank: 49
  },
  {
    title: "Django Unchained",
    description: "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation-owner in Mississippi.",
    releaseYear: 2012,
    rating: 8.4,
    duration: 165,
    genre: ["Drama", "Western"],
    director: "Quentin Tarantino",
    cast: ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"],
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_.jpg",
    imdbId: "tt1853728",
    imdbRank: 50
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@movieapp.com' });
    let adminUser;

    if (!adminExists) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@movieapp.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created: admin@movieapp.com / admin123');
    } else {
      adminUser = adminExists;
      console.log('Admin user already exists');
    }

    // Create test user if not exists
    const userExists = await User.findOne({ email: 'user@movieapp.com' });
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@movieapp.com',
        password: 'user123',
        role: 'user'
      });
      console.log('Test user created: user@movieapp.com / user123');
    }

    // Insert movies with admin as creator
    const moviesWithCreator = moviesData.map(movie => ({
      ...movie,
      createdBy: adminUser._id
    }));

    await Movie.insertMany(moviesWithCreator);
    console.log(`${moviesData.length} movies inserted successfully`);

    console.log('\nSeeding complete!');
    console.log('\nDefault credentials:');
    console.log('Admin: admin@movieapp.com / admin123');
    console.log('User: user@movieapp.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
