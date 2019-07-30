# Acoustisea

### Acoustisea is a GitHub like responsive web app for underwater acoustic data files. 

## Features:  
- Users can post underwater acoustic data.
- Users can update profile info and descriptions of their underwater acoustic data.
- Users can delete their own underwater acoustic data.
- Anyone can view underwater acoustic data by subtopic. (Users themselves would tag what subtopic their data falls under when uploading.)
- Anyone can view a user profile page and underwater acoustic data posted by that user.
- Only users can download posted underwater acoustic data.

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
- /marinebioacoustics
- /marinebioacoustics/:data_id
- /vesselsandvehicles
- /vesselsandvehicles/:data_id
- /environmental
- /environmental/:data_id
- /construction
- /construction/:data_id
- /user/:user_id
- /allusers


### File structure

- /src
    - /Components
        - Header.js
        - Header.scss
        - LoginRegister.js
        - LoginRegister.scss
        - Logout.js
        - Logout.scss
        - UserProfile.js
        - UserProfile.scss
        - PublicData.js
        - PublicData.scss
    - /redux
        - store.js
        - reducer.js
    - App.scss
    - App.js
    - App.test.js
    - index.js
    - reset.css
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
    data_id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    marineBio BOOLEAN,
    construction BOOLEAN,
    vehicle BOOLEAN,
    environmental BOOLEAN,
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE
);
```

### Amazon S3 (cloud storage service)

Bucket URL TBD. Bucket will be used to store the underwater acoustic data files.