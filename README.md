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



### file-structure

## server

### dependencies
- express
- massive
- express-session
- dotenv
- bcrypt

### server file structure


### endpoints

**auth**



**kill Count Endpoints**


## database

- user object

```sql
create table users(
    user_id serial primary key,
    username text not null,
    password text not null,
    email text not null,
    profile_picture text default 'https://cdn.pixabay.com/photo/2013/11/01/11/13/dolphin-203875_1280.jpg',
    biography text
);
```

- Acoustic Data object

```sql
create table dataDescription(
    data_id serial primary key,
    isPrivate boolean,
    marineBio boolean,
    construction boolean,
    vehicle boolean,
    environmental boolean,
    author references user(username),
    author_id references user(user_id)
)
```