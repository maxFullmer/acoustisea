# Acoustisea

### Acoustisea is a responsive web app for sharing underwater acoustic data files. 

## Features:  
- Users can upload underwater acoustic data and see descriptions on their own page.
- Users can update profile info in addition to descriptions of their underwater acoustic data.
- Users can delete their own underwater acoustic data.
- Users can be routed to category pages to view acoustic data associated with that category. (Users themselves tag what category their data falls under when uploading.)
- User can be routed to another user's profile/data page from the associated acoustic data displayed in category pages.
- Users can download posted underwater acoustic data, but must be logged in to download file.

## Planned Improvements and Features:
- Delete old profile pic from storage when user uploads new profile pic.
- Add a list of top contributers per category
- Add Educational Link Carousel in each category page
- Add a page that lets users browse all other users
- Add a metric for how many times file has been downloaded.

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
- toastify
- query-string
- js-file-download

### Routes

- / => (Home/Login)
- /user/:user_id
- /publicdata/subtopic?marinebioacoustics
- /publicdata/subtopic?vesselsandvehicles
- /publicdata/subtopic?civilengineering
- /publicdata/subtopic?environmental
- /\* 404: page not found



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
        - /UserData
            - UserData.js
            - UserData.scss
        - /UserInfo
            - UserInfo.js
            - UserInfo.scss
        - /SubtopicDisplayCenter
            - Subtopic.js
            - Subtopic.scss
        - /PublicData
            - PublicData.js
            - PublicData.scss
    - /redux
        - store.js
        - userReducer.js
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

**Auth**
- POST => /api/register => create new user in users table
- POST => /api/login => instantiate session

**Header**
- GET => /api/logout => terminate session 
- GET => /api/user_session => read session

**UserProfile**
#### UserInfo
- GET => /api/user/:user_id => get the info of a specific user from the users table
- PUT => /api/user/:user_id => update the info of the session user in the users table

#### UserData

- GET => /api/user_data/:user_id => get all the data info belonging to a specific user from the dataInfo table
- POST => /api/user_data_form => for the session user, add new data info to dataInfo table syncronized with uploading file to Amazon S3 cloud storage
- PUT => /api/user_data_form =>  for the session user, update a specific data info from the dataInfo table
- DELETE => /api/user_data => for the session user, delete a data info from the dataInfo table when a specific data file is deleted from Amazon S3 cloud storage

**SubtopicDisplayCenter**
#### PublicData
- GET => /api/publicData/:subtopicSelected => get all the data info pertaining to a subtopic from the dataInfo table

**data file (Amazon S3)**

- POST => /api/upload?file=filename => upload new file into Amazon S3 cloud storage
- GET => /api/download/:data_id => download a file from Amazon S3 cloud storage
- DELETE => /api/delete/:data_id => delete a file from Amazon S3 cloud storage


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
CREATE TABLE dataInfo(
    username TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    title VARCHAR(100),
    file_type TEXT NOT NULL,
    marine_bio BOOLEAN DEFAULT FALSE,
    vehicle BOOLEAN DEFAULT FALSE,
    civil_egr BOOLEAN DEFAULT FALSE,
    environmental BOOLEAN DEFAULT FALSE,
    data_summary TEXT DEFAULT NULL,
    upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
    data_id SERIAL PRIMARY KEY
);
```

### Amazon S3 (cloud storage service)

Instead, it's best to store the images elsewhere and then store a reference to them in your database. These days the easiest way of doing this is generally to use Amazon S3, which can cheaply and reliably store an unlimited number of images. Save them to S3, then store the S3 URL (or the bucket + key combination) in a string in your database row.

Bucket URL TBD. Bucket will be used to store the underwater acoustic data files and profile images.

dummy file:
'https://www.researchgate.net/profile/Brian_Branstetter/publication/293820383/figure/fig1/AS:329766868668419@1455633956429/Signature-whistle-of-the-dolphin-SAY-A-Waveform-of-the-whistle-and-B-spectrogram-of.png'