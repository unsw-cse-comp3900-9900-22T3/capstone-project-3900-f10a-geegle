create database geegleevents;

\connect geegleevents;

CREATE TABLE users(
    userID SERIAL PRIMARY KEY,
    firstName text NOT NULL,
    lastName text NOT NULL,
    email text UNIQUE NOT NULL,
    userPassword text NOT NULL
);

INSERT INTO USERS (userID, firstName, lastName, email, userPassword) VALUES (DEFAULT, 'John', 'SMITH', 'jsmith@email.com', 'password123');