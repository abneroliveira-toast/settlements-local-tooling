import { getS3FileStream } from '../src/s3/get-s3-file.js';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

const muidMap: { [submerchantId: string]: { guid: string } } = {
  ...getMuidJson('./data/result-0.json'),
  ...getMuidJson('./data/result-1.json'),
  ...getMuidJson('./data/result-2.json'),
  ...getMuidJson('./data/result-3.json'),
  ...getMuidJson('./data/result-4.json'),
  ...getMuidJson('./data/result-5.json'),
  ...getMuidJson('./data/result-6.json'),
  ...getMuidJson('./data/result-7.json'),
  ...getMuidJson('./data/result-8.json'),
  ...getMuidJson('./data/result-9.json'),
};

const s3FilesKeys = [
  '20230815/44002_0_e91e0838-5183-4c8a-8de8-fc85c54c3b48', // 000BRi00 -- already paid
  '20230815/44002_2_e5861c90-07c5-4797-8b89-b46404cf6a5e', // 000BRi02
  '20230815/44002_3_70e9f4f2-e43d-4eb6-911d-8522a313c97e', // 000BRi03
  '20230815/44003_0_c2924e8b-8355-4f44-87f5-c08f26232282', // 000BRj00
  '20230815/17771_0_9d6a8f3d-bb18-425a-95cf-ee9368c5d39b', // 0004cdzI
  '20230815/44002_1_0ee51bb1-2062-432d-aca8-76769cfedc61', // 000BRi01
];

const bucketName = 'stratus-capture-prod';

// Object/Hash will store the accumulated amount for the merchants using
// the submerchantId is the key
const hashMerchantsAggregated: { [submerchantId: string]: number } = {};

try {
  const filesToProcess = s3FilesKeys.length;
  let filesProcessed = 0;
  // making a Promise so we could wait to resolve (what is due when all files are retrieved from S3 and processed)
  await new Promise(async (resolve, reject) => {
    for (let s3File of s3FilesKeys) {
      const fileContent = await getS3FileStream(bucketName, s3File);
      if (fileContent) {
        var lineReader = readline.createInterface(
          fileContent,
          process.stdout,
          () => {
            console.log(`completerCalled`);
          },
          false
        );
        if (filesProcessed == 0) {
          console.log('submerchantId, amount');
        }
        lineReader.on('close', () => {
          filesProcessed += 1;
          if (filesProcessed == filesToProcess) {
            // if all the files where processed we resolve the Promise,
            // so we call write the aggregated values into the csv file
            resolve(null);
          }
        });
        lineReader.on('error', (e) => {
          reject(e);
        });
        lineReader.on('line', (line) => {
          if (line.startsWith('S')) {
            const { submerchantId, amount } =
              extractSubmerchantIdentifierAndAmount(line);

            if (hashMerchantsAggregated[submerchantId]) {
              hashMerchantsAggregated[submerchantId] =
                hashMerchantsAggregated[submerchantId] + amount;
            } else {
              hashMerchantsAggregated[submerchantId] = amount;
            }

            console.log(`${submerchantId},${amount / 100}`);
          }
        });
      }
    }
  });
  // after the promise above is resolved, we can save the resulting file
  var fileWritter = fs.createWriteStream(
    path.resolve('./file_aggregated.csv'),
    {
      flags: 'a', // 'a' means appending (old data will be preserved)
    }
  );
  //   var submerchantIdCsvFileWriter = fs.createWriteStream(
  //     path.resolve('./nodejs-scripts/submerchant_ids.csv'),
  //     {
  //       flags: 'a', // 'a' means appending (old data will be preserved)
  //     }
  //   );
  fileWritter.write('submerchantId, muid, amount\r\n');
  // submerchantIdCsvFileWriter.write('submerchantId, vendor\r\n');

  // for each submerchantId key, write the result to the csv file
  Object.keys(hashMerchantsAggregated).forEach((submerchantId) => {
    let muid = muidMap[submerchantId].guid;
    let amount = hashMerchantsAggregated[submerchantId] / 100;
    fileWritter.write(`${submerchantId}, ${muid}, ${amount}\r\n`);
    //submerchantIdCsvFileWriter.write(`${submerchantId}, CHS\r\n`);
  });
  fileWritter.close();
  //submerchantIdCsvFileWriter.close();
} catch (e) {
  console.log(`Failed to process ACT0010 files: ${e}`);
}

function extractSubmerchantIdentifierAndAmount(line: string): {
  submerchantId: string;
  amount: number;
} {
  /***
   * submerchantId = 11 (8 characters )
   * amount = 61 (12 characters)
   */
  const submerchantId = line.substring(11, 19);
  const amount = parseInt(line.substring(61, 72));
  return {
    submerchantId,
    amount,
  };
}
function getMuidJson(fileName: string): {
  [submerchantId: string]: { guid: string };
} {
  const jsonDataContent = fs
    .readFileSync(path.resolve(fileName))
    .toString('utf-8');
  return JSON.parse(jsonDataContent);
}
