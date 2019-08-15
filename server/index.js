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
app.use( express.static( `${__dirname}/../build` ) );

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
  const uploadProfile = (buffer, name, type) => {
    const profileParams = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: S3_BUCKET_PROFILE_IMG,
      ContentType: type.mime,
      Key: `${name}.${type.ext}`
    };
    return s3.upload(profileParams).promise();
  };

  
  // Upload Profile Picture:
  app.post(`/api/profile_pic`, (request, response) => {
    const profileForm = new multiparty.Form();
      profileForm.parse(request, async (err, fields, files) => {
        if (err) throw new Error(err);
        try {
          const path = files.file[0].path;
          const buffer = fs.readFileSync(path);
          const type = fileType(buffer);
          const timestamp = Date.now().toString();
          const fileName = `bucketFolder/${timestamp}-lg`;
          const data = await uploadProfile(buffer, fileName, type);
          return response.status(200).send(data);
        } catch (err) {
            console.log(err)
          return response.status(400).send(err);
        }
      });
  });

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
    const fileParams = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: S3_BUCKET_UA_FILES,
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    return s3.upload(fileParams).promise();
    };

// Upload Data File:
app.post(`/api/data_file`, (request, response) => {
    const fileForm = new multiparty.Form();
      fileForm.parse(request, async (err, fields, files) => {
        if (err) throw new Error(err);
        try {
          const path = files.file[0].path;
          const buffer = fs.readFileSync(path);
          const type = fileType(buffer);
          const timestamp = Date.now().toString();
          const fileName = `bucketFolder/${timestamp}-lg`;
          const data = await uploadFile(buffer, fileName, type);
          return response.status(200).send(data);
        } catch (err) {
            console.log(err)
          return response.status(400).send(err);
        }
      });
  });

// Retrieve Data File:
app.get(`/api/data_file`, (request, response) => {
    let key = request.query.s3key;
    console.log(request.query)
    let params = {
        // ACL: 'public-read',
        Bucket: S3_BUCKET_UA_FILES,
        Key: key
    };
    s3.getObject(params, function(err, data) {
        if (err) {
            console.log(err);
            response.status(400).send(err)
        }
        else {
            // fs.writeFileSync(filePath, data.Body.toString())
            response.status(200).send(data)
        }
    })
})

// Delete Profile Picture:


const path = require('path')
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.listen(SERVER_PORT, () => console.log(`Rogue 1 you are cleared for entry on port ${SERVER_PORT}`));