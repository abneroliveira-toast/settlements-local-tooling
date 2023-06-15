import dynamodb from 'dynamodb';
import joi from'joi';
const REGION = "us-east-1";
// Create an Amazon DynamoDB service client object.
dynamodb.AWS.config.update({ region: REGION });

dynamodb.log.level('debug'); //

//const schema = dynamodb.define('preproduction-payment-processing-configuration', {
export const schema = dynamodb.define('prod-payment-processing-configuration', {
    hashKey: 'PK',
    rangeKey: 'SK',
    schema: {
        'PK': joi.string(),
        'SK': joi.string(),
        muid: joi.string()
    },
    indexes : [{
        hashKey : 'PK', rangeKey : 'SK', type : 'local', name : 'PrimaryKey'
      }]
});

