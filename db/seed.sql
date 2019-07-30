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
    data_id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    marineBio BOOLEAN,
    construction BOOLEAN,
    vehicle BOOLEAN,
    environmental BOOLEAN,
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE
);

INSERT INTO datadescription (title, marineBio, construction, vehicle, environmental)
VALUES 
('Bottlenose Dolphin 55kHz', TRUE, FALSE, FALSE, FALSE);

SELECT * FROM users;
SELECT * FROM datadescription;