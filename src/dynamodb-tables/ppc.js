import dynamodb from "dynamodb";
import joi from "joi";
const REGION = "us-east-1";
// Create an Amazon DynamoDB service client object.
dynamodb.AWS.config.update({ region: REGION });

dynamodb.log.level("debug"); //

export function getSchema(envName) {
  const tableName =
    envName == "prod"
      ? "prod-payment-processing-configuration"
      : "preproduction-payment-processing-configuration";
  return dynamodb.define(tableName, {
    hashKey: "PK",
    rangeKey: "SK",
    schema: {
      PK: joi.string(),
      SK: joi.string(),
      muid: joi.string(),
    },
    indexes: [
      {
        hashKey: "PK",
        rangeKey: "SK",
        type: "local",
        name: "PrimaryKey",
      },
    ],
  });
}
