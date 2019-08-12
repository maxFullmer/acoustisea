require('dotenv').config();
const express = require('express');
const massive = require('massive');
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const session = require('express-session');
const authCtrl = require('./controllers/authController.js');
const userInfoCtrl = require('./controllers/userInfoController.js');
const dataInfoCtrl = require('./controllers/dataInfoController.js');
const { 
    SERVER_PORT,
    CONNECTION_STRING,
    SESSION_SECRET,
    S3_BUCKET_PROFILE_IMG,
    S3_BUCKET_UA_FILES,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
} = process.env;

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
app.delete('/api/user_data/:user_id', dataInfoCtrl.deleteUserDataInfo);

// DataInfo (for public)
app.get('/api/publicData/:subtopicSelected', dataInfoCtrl.getSubtopicDataInfo)

//Amazon S3 endpoints

// Set up:
    // configure the keys for accessing AWS
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  });
  
    // configure AWS to work with promises
  AWS.config.setPromisesDependency(bluebird);
  
    // create S3 instance
  const s3 = new AWS.S3();
  
    // abstracts function to upload a file returning a promise
  const uploadFile = (buffer, name, type) => {
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: S3_BUCKET_PROFILE_IMG,
      ContentType: type.mime,
      Key: `${name}.${type.ext}`
    };
    return s3.upload(params).promise();
  };

  
  // Upload Profile Picture:
  app.post(`/api/profile_pic`, (request, response) => {
    const form = new multiparty.Form();
      form.parse(request, async (error, fields, files) => {
        if (error) throw new Error(error);
        try {
          const path = files.file[0].path;
          const buffer = fs.readFileSync(path);
          const type = fileType(buffer);
          const timestamp = Date.now().toString();
          const fileName = `bucketFolder/${timestamp}-lg`;
          const data = await uploadFile(buffer, fileName, type);
          return response.status(200).send(data);
        } catch (error) {
            console.log(error)
          return response.status(400).send(error);
        }
      });
  });




app.listen(SERVER_PORT, () => console.log(`Rogue 1 you are cleared for entry on port ${SERVER_PORT}`));