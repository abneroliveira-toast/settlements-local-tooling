import { createArrayCsvWriter, createObjectCsvWriter } from 'csv-writer';
import * as path from 'path';
import { SQL_EXTENSION_REGEXP } from './constants.js';
import chalk from 'chalk';
import { ScriptResult, ScriptSuccessResult } from './types.js';
import * as fs from 'fs/promises';

export async function writeResults(
  scriptName: string,
  results: ScriptResult[]
) {
  const resultsToWrite: ScriptSuccessResult[] = results.flatMap((r) => {
    return 'data' in r ? r.data : [];
  });
  const fileBase = scriptName.replace(SQL_EXTENSION_REGEXP, '');
  const outputFileNameWithoutExtension = path.resolve(
    './output',
    `${fileBase}-${getFileUniqueExecutionIdentifier()}`
  );
  const csvFile = `${outputFileNameWithoutExtension}.csv`;
  const jsonFile = `${outputFileNameWithoutExtension}.json`;
  const csvWriter = createObjectCsvWriter({
    path: csvFile,
    header: Object.keys(resultsToWrite[0]).map((key) => ({
      title: key,
      id: key,
    })),
  });
  try {
    await fs.writeFile(
      `${outputFileNameWithoutExtension}.json`,
      JSON.stringify(resultsToWrite, null, 2)
    );
    await csvWriter.writeRecords(resultsToWrite);
    console.log(
      chalk.bold(`Output files: ${csvFile}, ${jsonFile} written successfully.`)
    );
  } catch (e) {
    console.error(chalk.red.bold(`Error (file could not be saved): ${e}`));
  }
}

function getFileUniqueExecutionIdentifier() {
  const currentDate = new Date();
  // current date
  // adjust 0 before single digit date
  const date = `0${currentDate.getDate()}`.slice(-2);

  // current month
  const month = `0${currentDate.getMonth() + 1}`.slice(-2);

  // current year
  const year = currentDate.getFullYear();

  return `${year}-${month}-${date}_${Math.floor(Date.now() / 1000)}`;
}
