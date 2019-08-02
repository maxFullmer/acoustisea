# Acoustisea

### Acoustisea is a GitHub like responsive web app for underwater acoustic data files. 

## Features:  
- Users can upload underwater acoustic data on their own page.
- Users can update profile info and descriptions of their underwater acoustic data.
- Users can delete their own underwater acoustic data.
- Users can be routed to subtopic page to view acoustic data associated with that subtopic. (Users themselves would tag what subtopic their data falls under when uploading.)
- User can be routed to another user's profile/data page from the associated acoustic data displayed in subtopic pages.
- Users can download posted underwater acoustic data.
- Must be logged in to download file.

## Front End

### Dependencies
- axios
- react-router-dom (BrowserRouter)
- redux
- react-redux
- node-sass
- react-icons/fa
- http-proxy-middleware
- redux-promise-middleware

### Routes

- / => (Home/Login)
- /user/:user_id
- /marinebioacoustics
- /vesselsandvehicles
- /construction
- /environmental
- \* 404: page not found



### File structure

- /src
    - /Components
        - /Header
            - Header.js
            - Header.scss
        - /Authentication
            - Authentication.js
            - Authentication.scss
        - /UserProfile
            - UserProfile.js
            - UserProfile.scss
        - /PublicData
            - PublicData.js
            - PublicData.scss
    - /redux
        - store.js
        - reducer.js
    - App.scss
    - App.js
    - App.test.js
    - index.js
    - index.css (reset.css)
    - setupProxy.js

    

## Back End

### Dependencies
- express
- massive
- express-session
- dotenv
- bcrypt

### File structure

 - /server
    - /Controllers
        - authController.js
        - userController.js
        - dataController.js
    - /middleware
        - middleware.js

### Endpoints

**auth**
- POST => /api/register => create new user in users table
- POST => /api/login => instantiate session
- GET => /api/logout => terminate session 
- GET => /api/user_session => read session

**user**
- GET => /api/user/:user_id => read the info of a specific user in the users table
- PUT => /api/user/:user_id => update the info of the session user in the users table

**data**

##### data file
- POST => /api/upload?file=filename => upload new file into Amazon S3 cloud storage
- GET => /api/download/:data_id => download a file from Amazon S3 cloud storage
- DELETE => /api/delete/:data_id => delete a file from Amazon S3 cloud storage

##### data description

- GET => /api/user_data/:user_id => view the descrpitions of the data files belonging to a specific user or the session user
- POST => /api/user_data/:user_id/ => add new description when data file is uploaded to Amazon S3
- PUT => /api/user_data/:user_id/:data_id => update description of a specific data file of the session user
- DELETE => /api/delete/:data_id => delete the description when a specific data file is deleted from Amazon S3 cloud storage


## Databases

### Heroku PostGres

- User object

```sql
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    profile_picture TEXT DEFAULT 'https://cdn.pixabay.com/photo/2013/11/01/11/13/dolphin-203875_1280.jpg',
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    biography TEXT
);
```

- Data object (description, not actual underwater acoustic data file)

```sql
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
```

### Amazon S3 (cloud storage service)

Bucket URL TBD. Bucket will be used to store the underwater acoustic data files.

dummy file:
'https://www.researchgate.net/profile/Brian_Branstetter/publication/293820383/figure/fig1/AS:329766868668419@1455633956429/Signature-whistle-of-the-dolphin-SAY-A-Waveform-of-the-whistle-and-B-spectrogram-of.png'