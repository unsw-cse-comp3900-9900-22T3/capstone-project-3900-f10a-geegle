create database geegleevents;

\connect geegleevents;

CREATE TABLE users(
    userID SERIAL PRIMARY KEY,
    firstName text NOT NULL,
    lastName text NOT NULL,
    email text UNIQUE NOT NULL,
    userPassword text NOT NULL
);

CREATE TABLE venues (
    venueID SERIAL PRIMARY KEY,
    venueName text NOT NULL,
    venueLocation text NOT NULL,
    maxCapacity integer NOT NULL
);

CREATE TABLE seats (
    seatID SERIAL PRIMARY KEY,
    seatSection text,
    seatRow text,
    seatNo integer,
    venueID integer,
    foreign key (venueID)
        references venues (venueID)
);

CREATE TABLE events(
    eventID SERIAL PRIMARY KEY,
    eventName text NOT NULL,
    hostID integer NOT NULL,
    startDateTime timestamptz NOT NULL,
    endDateTime timestamptz NOT NULL,
    eventDescription text,
    eventType text,
    eventVenue integer NOT NULL,
    capacity integer NOT NULL,
    totalTicketAmount integer NOT NULL,
    published boolean DEFAULT FALSE,
    image1 text,
    image2 text,
    image3 text,
    foreign key (hostID)
        references users(userID),
    foreign key (eventVenue)
        references venues (venueID)
);

CREATE TABLE eventMessages (
    messageID SERIAL,
    eventID integer NOT NULL,
    msg text NOT NULL,
    msgTime timestamptz NOT NULL,
    primary key (eventID, messageID),
    foreign key (eventID)
        references events (eventID) ON DELETE CASCADE
);

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
    seatID integer,
    foreign key (eventID)
        references events(eventID) ON DELETE CASCADE,
    foreign key (seatID)
        references seats(seatID)
);

CREATE TABLE creditCardDetails(
    creditCardID SERIAL PRIMARY KEY,
    creditCardNum char(16) check (creditCardNum ~ '[0-9]{16}'),
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
    ticketPurchaseTime timestamptz NOT NULL,
    primary key(ticketID),
    foreign key (userID)
        references users(userID),
    foreign key (ticketID)
        references tickets(ticketID) ON DELETE CASCADE
);

CREATE TABLE reviews (
    reviewID SERIAL PRIMARY KEY,
    eventID integer NOT NULL,
    userID integer NOT NULL,
    rating integer NOT NULL,
    review text,
    postedOn timestamptz NOT NULL,
    edited boolean DEFAULT FALSE,
    foreign key (eventID)
        references events (eventID) ON DELETE CASCADE,
    foreign key (userID)
        references users (userID)
);

CREATE TABLE reviewReplies (
    replyID SERIAL,
    reviewID integer NOT NULL,
    userID integer NOT NULL,
    reply text NOT NULL,
    repliedOn timestamptz NOT NULL,
    primary key (reviewID, replyID),
    foreign key (reviewID)
        references reviews (reviewID) ON DELETE CASCADE,
    foreign key (userID)
        references users (userID)
);

CREATE TABLE reviewLikes (
    reviewID integer,
    userID integer,
    primary key (reviewID, userID),
    foreign key (reviewID)
        references reviews (reviewID) ON DELETE CASCADE,
    foreign key (userID)
        references users(userID)
);

CREATE TABLE eventTicketToSeatingAllocation (
    eventID SERIAL,
    ticketType text,
    seatSection text,
    primary key (eventID, ticketType, seatSection),
    foreign key (eventID) 
        references events (eventID) ON DELETE CASCADE
);

CREATE TABLE eventSimilarity (
    event1 integer NOT NULL,
    event2 integer NOT NULL,
    similarity_rating decimal,
    primary key (event1, event2),
    foreign key (event1)
        references events(eventID) ON DELETE CASCADE,
    foreign key (event2)
        references events(eventID) ON DELETE CASCADE
);

CREATE TABLE eventMetrics (
    eventID integer NOT NULL,
    pageViews integer NOT NULL,
    dataDay timestamptz NOT NULL,
    ticketCheckouts integer NOT NULL,
    
    primary key (eventID, dataDay),
    foreign key (eventID)
        references events(eventID) ON DELETE CASCADE
);

CREATE TABLE eventGoalMetrics (
    eventID integer NOT NULL,
    publishedGoal boolean DEFAULT FALSE,
    publishedGoalTime timestamptz,
    tenSalesGoal boolean DEFAULT FALSE,
    tenSalesGoalTime timestamptz,
    halfSalesGoal boolean DEFAULT FALSE,
    halfSalesGoalTime timestamptz,
    threeQuarterSalesGoal boolean DEFAULT FALSE,
    threeQuarterSalesGoalTime timestamptz,
    soldOutSalesGoal boolean DEFAULT FALSE,
    soldOutSalesGoalTime timestamptz,
    fiveMaxReviewsGoal boolean DEFAULT FALSE,
    fiveMaxReviewsGoalTime timestamptz,
    tenMaxReviewsGoal boolean DEFAULT FALSE,
    tenMaxReviewsGoalTime timestamptz,
    primary key (eventID),
    foreign key (eventID)
        references events(eventID) ON DELETE CASCADE
);

CREATE TABLE eventTaskList (
    taskID integer NOT NULL,
    eventID integer NOT NULL,
    taskDescription text NOT NULL,
    taskCompleted boolean DEFAULT FALSE,
    primary key (taskID),
    foreign key (eventID)
        references events(eventID) ON DELETE CASCADE
);

--CREATE TABLE eventTicketToSeatingAllocation (
--    ticketID SERIAL,
--    seatSection text,
--    primary key (ticketID, seatSection),
--    foreign key (ticketID) 
--        references events (ticketID)
--);


INSERT INTO USERS (userID, firstName, lastName, email, userPassword) VALUES (DEFAULT, 'John', 'SMITH', 'jsmith@email.com', 'password123');

INSERT INTO VENUES (venueID, venueName, venueLocation, maxCapacity) VALUES (DEFAULT, 'Accor Stadium', 'Edwin Flack Ave, Sydney Olympic Park NSW 2127', 83500);
INSERT INTO VENUES (venueID, venueName, venueLocation, maxCapacity) VALUES (DEFAULT, 'ICC Sydney', '14 Darling Dr, Sydney NSW 2000', 5000);
INSERT INTO VENUES (venueID, venueName, venueLocation, maxCapacity) VALUES (DEFAULT, 'Ivy Precinct', '330 George St, Sydney NSW 2000', 1000);
INSERT INTO VENUES (venueID, venueName, venueLocation, maxCapacity) VALUES (DEFAULT, 'Doltone House - Jones Bay Wharf', 'level 3/26-32 Pirrama Rd, Pyrmont NSW 2009', 750);
INSERT INTO VENUES (venueID, venueName, venueLocation, maxCapacity) VALUES (DEFAULT, 'UNSW Roundhouse', 'Roundhouse (E6), Anzac Parade, UNSW Sydney, Kensington NSW 2052', 2200);

INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 1', 'A', '1', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 1', 'A', '2', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 1', 'A', '3', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 1', 'A', '4', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 1', 'B', '5', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 1', 'B', '6', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 1', 'B', '7', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 1', 'B', '8', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 2', 'A', '1', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 2', 'A', '2', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 2', 'B', '3', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Level 2', 'B', '4', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Private Suites', 'A', '1', 1);
INSERT INTO SEATS (seatID, seatSection, seatRow, seatNo, venueID) VALUES (DEFAULT, 'Private Suites', 'A', '2', 1);


INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 1', 1, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 1', 2, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 1', 3, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 2', 1, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 2', 2, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 2', 3, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 3', 1, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 3', 2, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 3', 3, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 4', 1, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 4', 2, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 4', 3, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 4', 4, 4);
INSERT INTO SEATS (seatID, seatSection, seatNo, venueID) VALUES (DEFAULT, 'Table 4', 5, 4);