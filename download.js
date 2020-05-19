const AWS = require('aws-sdk');
const BUCKET_NAME = process.env.BUCKET_NAME;
const ID = process.env.BUCKET_ID;
const SECRET = process.env.BUCKET_SECRET;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const downFile = ( fileName) => {

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName, // File name you want to save as in S3
  };

  // Uploading files to the bucket
  s3.getObject(params, function(err, data) {
    if (err) {
      throw err;
    } else {
      console.log(data);

    }
  });
};

module.exports = downFile;