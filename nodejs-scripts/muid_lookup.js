import { getSchema } from "../src/dynamodb-tables/ppc.js";
import csvParse from "csv-reader";
import * as fs from "fs";
import * as path from "path";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const run = async () => {
  const mids = await getSubmerchantsIdsInCSV();
  let result;
  let i = 0;
  const batchSize = 500;
  const steps = Math.ceil(mids.length / batchSize);
  result = {};
  for (let i = 0; i < steps; i++) {
    try {
      const lownBoundIndex = i * batchSize;
      const topIndex = (i + 1) * batchSize;
      const actualTopIndex = topIndex > mids.length ? mids.length : topIndex;
      const batch = mids.slice(lownBoundIndex, actualTopIndex);
      const batchItemsArgArr = batch.map((row) => ({
        PK: `MERCHANT_ID#${row.submerchantId}`,
        SK: `VENDOR#${row.vendor}`,
      }));
      console.log(batchItemsArgArr);
      let fileName = path.join(process.env.PWD, `./output/muids-${i}.json`);
      console.log(fileName);
      fs.writeFileSync(fileName, JSON.stringify(batchItemsArgArr));

      const envName = process.env["TOAST_ENV"] == "prod" ? "prod" : "preprod";
      const resultDynamoList = await getSchema(envName).getItems(
        batchItemsArgArr
      );

      for (let rowIndex = 0; rowIndex < resultDynamoList.length; rowIndex++) {
        let resultDynamo = resultDynamoList[rowIndex];
        let mid = resultDynamo.attrs.PK.replaceAll("MERCHANT_ID#", "");
        result[mid] = {
          guid: resultDynamo.attrs.muid,
          vendor: mids[rowIndex].vendor,
        };
      }
      console.log("Loop: " + i);
      await delay(1000);
      const fileNameResult = path.join(
        process.env.PWD,
        `data/result-${i}.json`
      );
      fs.writeFileSync(fileNameResult, JSON.stringify(result));
    } catch (err) {
      console.log("Error", err);
    }
  }
  const fileNameResult = path.join(process.env.PWD, `./output/mids_${i}.json`);
  fs.writeFileSync(fileNameResult, JSON.stringify(result));
  console.table(result);
};

await run();

async function getSubmerchantsIdsInCSV() {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve("./nodejs-scripts/submerchant_ids.csv");
    console.log(`FILE PATH: ${filePath}`);
    const rows = [];
    fs.createReadStream(filePath, "utf8")
      .pipe(csvParse({ skipHeader: true, trim: true }))
      .on("data", (row) => rows.push({ submerchantId: row[0], vendor: row[1] }))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}
