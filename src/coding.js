const AWS = require("aws-sdk");

// Configure the SDK with your access keys and region
AWS.config.update({
  accessKeyId: "ASIAQAVUNXM4CMP3YEMO",
  secretAccessKey: "AKgy4LXxQgN9jmVFQpH0kQ51j+MtzBKbJ3V4uY1i",
  sessionToken:
    "FwoGZXIvYXdzEMH//////////wEaDPCMUdYFCTJyapQuzyK/ASSGUkAbIuRtXIsBta1euwOIODUKjyka9WduG9ZT49lX0PXRW5ze29WFnsqYtfjTUCTf2biXDuA0GM4E5msXKG5hFmhvM0/LeZog/4HIJyYgC7Xz0sD5IrzgJChJ0LW9Yw3r+EjIxaJgCD+8O3YyIO1Ftm8Az+MN4MU/69LK3T9rHtYUd8ECpG7tnXAZQjDVxb5IJOpIDtHBZSF9S3xBhoUvEMiex5ZuVT6Rh6uU2+X5XVNiqlmKf7rvzyF/cVAUKJaH4qAGMi62Q4LiTfe3TMfpJ5GT0QgZQ+7Z5VIDMeuy/rDWMF4IqGqYc1GBac766x7bfn8k",
  region: "us-east-1",
});
const s3 = new AWS.S3();
const comprehend = new AWS.Comprehend();
const bucketName = "computestorage";
const objectKey = "sentiment.txt";

exports.handler = async (event) => {
  console.log(event);
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const params = {
    Bucket: bucket,
    Key: key,
  };
  try {
    const { Body } = await s3.getObject(params).promise();
    const text = Body.toString();
    console.log(text);
    console.log("CONTENT TYPE:", text);
    const languageParams = {
      Text: text,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
  try {
    const result = await comprehend
      .detectDominantLanguage(languageParams)
      .promise();
    const dominantLanguage = result.Languages[0].LanguageCode;
    var sentimentParams = {
      Text: text,
      LanguageCode: dominantLanguage,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
  try {
    const sentiment = await comprehend
      .detectSentiment(sentimentParams)
      .promise();
    console.log(sentiment);
    console.log(typeof sentiment);
    console.log(sentiment.Sentiment);
    console.log(typeof sentiment.Sentiment);
    const payload = { message: sentiment.Sentiment };
    console.log(payload);
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          "Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.",
      }),
    };
  }
};
