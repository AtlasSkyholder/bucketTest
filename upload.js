const fs = require('fs');
const AWS = require('aws-sdk');
const BUCKET_NAME = process.env.BUCKET_NAME;

const uploadFile = (fileName) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'cat.jpg', // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    } else {
      console.log(`File uploaded successfully. ${data.location}`);
    }
  });
};

module.exports = uploadFile;