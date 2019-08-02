DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS datadescription;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    profile_picture TEXT DEFAULT 'https://cdn.pixabay.com/photo/2013/11/01/11/13/dolphin-203875_1280.jpg',
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    biography TEXT
);

INSERT INTO users (username, password, email, biography)
VALUES
('Finny', 'kekek', 'dolphinisHim@sonarrr.com', 'Just a phin flipping around');

CREATE TABLE datadescription(
    username TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    title VARCHAR(100),
    file_type TEXT NOT NULL,
    marineBio BOOLEAN DEFAULT FALSE,
    vehicle BOOLEAN DEFAULT FALSE,
    construction BOOLEAN DEFAULT FALSE,
    environmental BOOLEAN DEFAULT FALSE,
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
    data_id SERIAL PRIMARY KEY
);

INSERT INTO datadescription (username, user_id, title, file_type, marineBio)
VALUES 
('sealio', 2, 'Bottlenose Dolphin 5-21kHz', 'png', TRUE);

SELECT * FROM users;
SELECT * FROM datadescription;