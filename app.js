// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const AWS = require('aws-sdk');


// Enter copied or downloaded acess ID and secret key here
const ID = process.env.BUCKET_ID;
const SECRET = process.env.BUCKET_SECRET;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const params = {
  Bucket: BUCKET_NAME,
  CreateBucketConfiguration: {
    // Set your region here
    LocationConstraint: process.env.BUCKET_AREA
  }
};

s3.createBucket(params, function(err, data){
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log('Bucket Created Successfully', data.location);
  }
});

app.listen(PORT, process.env.IP, function(){
  console.log(`Example app listening on port ${PORT}`);
});