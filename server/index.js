require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session')
const authCtrl = require('./controllers/authController.js');
const dataInfoCtrl = require('./controllers/dataInfoController');
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

//auth endpoints
app.post('/api/register', authCtrl.register);
app.post('/api/login', authCtrl.login);
app.get('/api/logout', authCtrl.logout);
app.get('/api/user_session', authCtrl.userSession);

//user endpoints

//data info endpoints
app.get('/api/user_data/:user_id', dataInfoCtrl.getDataInfo)
app.post('/api/user_data_form', dataInfoCtrl.addDataInfo)

//data file endpoints



app.listen(SERVER_PORT, () => console.log(`Rogue 1 you are cleared for entry on port ${SERVER_PORT}`));