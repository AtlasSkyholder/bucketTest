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

app.get("/upload", function(req, res){
  console.log(req.body);
  // let img = req.body;
  res.render("download");
});

app.post("/", function(req,res){
  console.log(req.file);
  let item = req.body.img;
  console.log(item);
  uploadFile(item);
  res.redirect("upload", /* {item: item} */);
});

app.listen(PORT, process.env.IP, function(){
  console.log(`Example app listening on port ${PORT}`);
});