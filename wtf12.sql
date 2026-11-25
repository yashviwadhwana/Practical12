CREATE DATABASE EventManagement;
USE EventManagement;

CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  participant_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE Events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(150) NOT NULL,
  organizer_name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  event_date DATE NOT NULL,
  venue VARCHAR(150) NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL
);

CREATE TABLE Registrations (
  registration_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_id INT,
  registration_date DATE,
  status VARCHAR(30),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (event_id) REFERENCES Events(event_id)
);

INSERT INTO Events
(event_name, organizer_name, category, event_date, venue, total_seats, available_seats)
VALUES
('Hackathon 2026', 'Coding Club', 'Technical', '2026-12-05', 'Main Auditorium', 100, 100),
('Annual Cultural Fest', 'Cultural Committee', 'Cultural', '2026-12-12', 'Open Air Theatre', 250, 250),
('Inter-College Cricket', 'Sports Department', 'Sports', '2026-12-18', 'College Ground', 60, 60),
('Web Development Workshop', 'IT Department', 'Workshop', '2026-12-20', 'Seminar Hall', 80, 80),
('AI Awareness Seminar', 'Research Cell', 'Seminar', '2026-12-22', 'Conference Room', 120, 120);

SELECT * FROM Users;
SELECT * FROM Events;
SELECT * FROM Registrations;

SELECT * FROM Events
WHERE available_seats > 0;
