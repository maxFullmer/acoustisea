DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS dataInfo;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    profile_picture TEXT DEFAULT 'https://acoustisea-profile-img.s3.us-east-2.amazonaws.com/dolphin-203875_1920.jpg',
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    biography TEXT
);

INSERT INTO users (username, password, email, biography)
VALUES
('Waldo', 'kekek', 'dolphinisHim@sonarrr.com', 'Just a phin flipping around');

CREATE TABLE dataInfo(
    username TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    title VARCHAR(100),
    file_type TEXT NOT NULL,
    subtopic TEXT NOT NULL,
    data_summary TEXT DEFAULT NULL,
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
    data_id SERIAL PRIMARY KEY,
    s3link TEXT NOT NULL,
    s3key TEXT NOT NULL
);

INSERT INTO dataInfo (username, user_id, title, file_type, subtopic, data_summary, s3link, s3key)
VALUES 
('Waldo', 1, 'Bottlenose Dolphin - social', '.png', 'marBio','You found me! Here is your reward','https://acoustisea-ua-files.s3.us-east-2.amazonaws.com/dolphin-203875_1920.jpg','dolphin-203875_1920.jpg');

SELECT * FROM users;
SELECT * FROM dataInfo;