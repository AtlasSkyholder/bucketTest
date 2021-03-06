// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const AWS = require('aws-sdk');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const uploadFile = require("./upload.js");

const fileUps = require('express-fileupload');


// Enter copied or downloaded acess ID and secret key here
const ID = process.env.BUCKET_ID;
const SECRET = process.env.BUCKET_SECRET;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_AREA = process.env.BUCKET_AREA;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const params = {
  Bucket: BUCKET_NAME
};

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(fileUps());

app.get("/", function(req,res){
  res.render("index");
});

app.get("/bucket", function(req,res){

  let string;

  s3.createBucket(params, function(err, data){
    if (err) {
      console.log(err, err.stack);
    } else {
      string = data.location;
      console.log('Bucket Created Successfully', data.location);
    }
  });

  res.render("bucket", {string: string});
});

app.get("/upload/:id", function(req, res){
  const name = req.params.id;
  const path = `https://${BUCKET_NAME}.s3.amazonaws.com/${name}`;

  res.render("download", {path: path});
});

app.post("/", function(req,res){
  if(req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const file = req.files.img;
  
  file.mv(`${__dirname}/uploads/${file.name}`, function(err) {
    if(err) {
      console.error(err);
      return res.status(500).send(err);
    }
    
    
  });

  console.log(file);

  uploadFile(file.data ,file.name);
  res.redirect("/upload");
});

app.get("/list", function(req, res){
 
  let stuff = async () => {
    return new Promise((resolve, reject) => {
      s3.listObjects(params, function(err, data){
        if (err) {
          reject(err);
        } else {
          resolve(data.Contents);
        }
      })
    })
   
  }


  stuff().then((data) => {

    const contents = data.filter((item) => {return item.Size > 0})

    res.render("list", {contents: contents});
  })

  
})

app.listen(PORT, process.env.IP, function(){
  console.log(`Example app listening on port ${PORT}`);
});