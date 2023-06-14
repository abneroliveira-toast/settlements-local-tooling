import inquirer from 'inquirer';
import chalk from 'chalk';
import * as path from 'path';
import { chooseScriptToRun } from './choose-script-to-run.js';
import { getAvailableScripts } from './get-available-scripts.js';
import { prepareExecution } from './prepare-execution.js';
import { readFileContent } from './read-file-content.js';
import { executeScript } from './execute-script.js';
import ora, { Ora, spinners } from 'ora';
import { DEFAULT_SPINNER, SCRIPTS_FOLDER } from './constants.js';
import { highlight } from 'cli-highlight';
import { writeResults } from './write-results.js';
console.clear();

const fgOrange = chalk.hex('#FFA500');
const bgOrange = chalk.bgHex('#FFA500');
const subtitleStyle = fgOrange.underline;
console.log(
  fgOrange(`
████████╗░█████╗░░█████╗░░██████╗████████╗
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝
░░░██║░░░██║░░██║███████║╚█████╗░░░░██║░░░
░░░██║░░░██║░░██║██╔══██║░╚═══██╗░░░██║░░░
░░░██║░░░╚█████╔╝██║░░██║██████╔╝░░░██║░░░
░░░╚═╝░░░░╚════╝░╚═╝░░╚═╝╚═════╝░░░░╚═╝░░░`)
);
console.log(subtitleStyle('        Payments Settlements Team         \n\n'));
let spinner: Ora | undefined;
try {
  const availableScripts = await getAvailableScripts();
  const nameScriptToRun = await chooseScriptToRun(availableScripts);
  const scriptChosenFilePath = path.join(
    process.cwd(),
    SCRIPTS_FOLDER,
    nameScriptToRun
  );
  const { scriptContent, manifestContent } = await readFileContent(
    scriptChosenFilePath
  );
  console.log(chalk.bold('SCRIPT: ', nameScriptToRun));
  console.log(`===================================================================================

${highlight(scriptContent)}

===================================================================================`);

  const scriptToRun = await prepareExecution(scriptContent, manifestContent);

  const spinner = ora({
    text: 'Executing the script',
    spinner: DEFAULT_SPINNER,
  }).start();
  const results = await executeScript(scriptToRun);
  spinner.stop();
  await writeResults(nameScriptToRun, results);
  for (let result of results) {
    console.log(chalk.bold(`RESULT FOR SHARD: ${result.shard}`));
    if ('data' in result) {
      console.table(result.data);
    } else {
      console.error(chalk.redBright(`ERROR: ${result.error}`));
    }
  }
} catch (e) {
  spinner?.stop();
  console.error(
    chalk.bold.red(`Failed to execute script:
        $${e}
    `)
  );
}
