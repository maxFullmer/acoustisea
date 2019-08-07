require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session')
const authCtrl = require('./controllers/authController.js');
const userInfoCtrl = require('./controllers/userInfoController.js')
const dataInfoCtrl = require('./controllers/dataInfoController.js');
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

const app = express();
app.use(express.json());

massive(CONNECTION_STRING).then(db => {
    console.log('Connected to db');
    app.set('db', db)
}).catch(err => console.log(err))

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 3600 * 24 * 14 // a fortnight (aka 2 weeks)
    }
}))

// Authorization
app.post('/api/register', authCtrl.register);
app.post('/api/login', authCtrl.login);

// Header
app.get('/api/logout', authCtrl.logout);
app.get('/api/user_session', authCtrl.userSession);

//UserInfo
app.get('/api/user/:user_id', userInfoCtrl.getUserInfo);
app.put('/api/user/bio/:user_id', userInfoCtrl.updateUserBio);
app.put('/api/user/profile_picture/:user_id', userInfoCtrl.updateUserPic)

// DataInfo (for a user)
app.get('/api/user_data/:user_id', dataInfoCtrl.getUserDataInfo);
app.post('/api/user_data_form', dataInfoCtrl.addUserDataInfo);
app.put('/api/user_data_form', dataInfoCtrl.updateUserDataInfo);
app.delete('/api/user_data', dataInfoCtrl.deleteUserDataInfo);

// DataInfo (for public)
app.get('/api/publicData/:subtopicSelected', dataInfoCtrl.getSubtopicDataInfo)

//Amazon S3 endpoints



app.listen(SERVER_PORT, () => console.log(`Rogue 1 you are cleared for entry on port ${SERVER_PORT}`));