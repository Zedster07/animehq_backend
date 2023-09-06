-- Create the database

CREATE DATABASE IF NOT EXISTS algdoc_auth;


-- Create the Role table
CREATE TABLE IF NOT EXISTS Roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Insert sample roles
INSERT INTO Roles (name) VALUES  ('Super-Admin') , ('Admin'), ('User');


-- -- Use the database
-- USE algdoc_auth;

-- -- Create the User table
-- CREATE TABLE IF NOT EXISTS Users (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   username VARCHAR(255) NOT NULL UNIQUE,
--   password VARCHAR(255) NOT NULL,
--   email VARCHAR(255) NOT NULL UNIQUE,
--   emailVerified BOOLEAN DEFAULT false,
--   mobile VARCHAR(255),
--   profilePicture VARCHAR(255),
--   dob DATE,
--   gender VARCHAR(255),
--   fname VARCHAR(255),
--   lname VARCHAR(255),
--   isDeactivated BOOLEAN DEFAULT false,
--   isDeleted BOOLEAN DEFAULT false
-- );


-- -- Create the hasRole table
-- CREATE TABLE IF NOT EXISTS hasRoles (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   UserId INT,
--   RoleId INT,
--   permissions JSON,
--   organization INT
-- );



-- -- Insert sample user records
-- INSERT INTO Users (username, password, email, emailVerified, mobile, profilePicture, dob, gender, fname, lname)
-- VALUES
--   ('user1', 'password1', 'user1@example.com', true, '1234567890', 'profile1.jpg', '1990-01-01', 'male', 'John', 'Doe'),
--   ('user2', 'password2', 'user2@example.com', false, '9876543210', 'profile2.jpg', '1995-02-15', 'female', 'Jane', 'Smith'),
--   ('user3', 'password3', 'user3@example.com', true, NULL, NULL, NULL, NULL, NULL, NULL);

-- -- Assign roles to users
-- INSERT INTO hasRoles (UserId, RoleId) VALUES
--   (1, 1), -- user1 is an Admin
--   (2, 2), -- user2 is a User
--   (3, 3); -- user3 is a Manager