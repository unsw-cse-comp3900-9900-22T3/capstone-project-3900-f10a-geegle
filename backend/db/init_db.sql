create database geegleevents;

\connect geegleevents;

CREATE TABLE users(
    userID SERIAL PRIMARY KEY,
    firstName text NOT NULL,
    lastName text NOT NULL,
    email text UNIQUE NOT NULL,
    userPassword text NOT NULL
);

CREATE TABLE events(
    eventID SERIAL PRIMARY KEY,
    eventName text NOT NULL,
    hostID integer NOT NULL,
    startDateTime timestamptz NOT NULL,
    endDateTime timestamptz NOT NULL,
    eventDescription text,
    eventLocation text NOT NULL,
    eventVenue text NOT NULL,
    capacity integer NOT NULL,
    totalTicketAmount integer NOT NULL,
    published boolean DEFAULT FALSE,
    image1 text,
    image2 text,
    image3 text,
    foreign key (hostID)
        references users(userID)
);

-- CREATE TABLE venues (
--     venueID SERIAL PRIMARY KEY,
--     venueLocation text NOT NULL,

-- )

-- CREATE TABLE ticketType (
--     ticketTypeID SERIAL PRIMARY KEY,
--     amount integer,
--     venueID integer,
--     price integer NOT NULL,

--     foreign key (venueID)
--         references venues (venueID)
-- )

CREATE TABLE tickets(
    ticketID SERIAL PRIMARY KEY,
    ticketType text NOT NULL,
    price decimal NOT NULL,
    eventID integer NOT NULL,
    foreign key (eventID)
        references events(eventID) ON DELETE CASCADE
);

CREATE TABLE creditCardDetails(
    creditCardNum char(16) check (creditCardNum ~ '[0-9]{16}')  PRIMARY KEY,
    ccv char(3) NOT NULL check (ccv ~ '[0-9]{3}'),
    expiryMonth char(2) check (expiryMonth ~ '[0-9]{2}') NOT NULL,
    expiryYear char(2) check (expiryYear ~ '[0-9]{2}') NOT NULL,
    userID integer NOT NULL,
    foreign key (userID)
        references users(userID)
);

CREATE TABLE paypalDetails (
    accountID integer PRIMARY KEY,
    userID integer NOT NULL,
    foreign key(userID)
        references users(userID)
);

CREATE TABLE ticketPurchases (
    userID integer NOT NULL,
    ticketID integer NOT NULL,
    ticketPurchaseTime timestamp NOT NULL,
    primary key(ticketID),
    foreign key (userID)
        references users(userID),
    foreign key (ticketID)
        references tickets(ticketID) ON DELETE CASCADE
);


INSERT INTO USERS (userID, firstName, lastName, email, userPassword) VALUES (DEFAULT, 'John', 'SMITH', 'jsmith@email.com', 'password123');
