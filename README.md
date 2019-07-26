# Acoustisea

Audience: Anyone interested in underwater acoustics.
Data: Spectrograms and other acoustic data.
Features:  
- a) User account: People can create their own accounts and upload data. 
- b) Public vs. private: Users can choose which data is public or private 
- c) Navigation: Anyone or other users only (haven't decided which yet) can search public data by subtopic. Users themselves would tag what subtopic their data falls under. People (anyone or other users only) would then be able to see lists of just the data, or a list of users who have public data in that subtopic.
- d) download/view tally of data. Not high on the priority list, but something I would consider working on later.

## client

### dependencies
- axios
- react-router-dom (BrowserRouter)
- redux
- react-redux
- node-sass
- react-icons/fa
- http-proxy-middleware
- redux-promise-middleware

### routes

- home => / => Login.js
- profile => /profile => Profile.js
- killMap => /kill_map => KillMap.js

### file-structure

- src/
    - components/
        - Profile/
            - Profile.js
            - Profile.css / .scss
        - killMap/
            - KillMap.js
            - KillMap.css / .scss
        - Home/
            - Login.js
            - Login.css / .scss
    - App.js
    - App.css
    - index.js
    - setupProxy.js
    
    - reset.css
    - redux
        - store.js
        - reducer.js


## server

### dependencies
- express
- massive
- express-session
- dotenv
- bcrypt

### server file structure
- server/
    - index.js
    - middlewares
        - middleware.js
    - controller
        - killCountController.js
        - authController.js

### endpoints

**auth**

- login: => /api/login
- register: => /api/register
- logout: => /api/logout
- userSession: => /api/user_session

**kill Count Endpoints**

- getAllUsers: => /api/users
- killUser: => /api/kill_User
- updateDistance: => /api/distance
- deleteUser: => /api/obliterate

## database

- users

```sql
create table users(
    user_id serial primary key,
    username text not null,
    password text not null,
    email text not null
);
```

- user info

```sql
create table profile(
    profile_id serial primary key,
    picture text default 'https://cdn.pixabay.com/photo/2013/11/01/11/13/dolphin-203875_1280.jpg',
    user_id integer references users(user_id)
    biography text,
);
```

- data visibilty

```sql
create table subtopic(
    
)
```