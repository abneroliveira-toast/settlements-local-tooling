import inquirer from 'inquirer';
import chalk from 'chalk';
import { chooseScriptToRun } from './choose-script-to-run.js';
import { getAvailableScripts } from './get-available-scripts.js';
import { prepareExecution } from './prepare-execution.js';
import { readFileContent } from './read-file-content.js';
import { executeScript } from './execute-script.js';
import ora, { Ora, spinners } from 'ora';
import { DEFAULT_SPINNER } from './constants.js';
import { highlight } from 'cli-highlight';
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
  const scriptToRun = await chooseScriptToRun(availableScripts);
  const { scriptContent, manifestContent } = await readFileContent(scriptToRun);
  console.log(chalk.bold('SCRIPT: ', scriptToRun));
  console.log(`=================================================================

${highlight(scriptContent)}

=================================================================`);

  const scriptExecution = await prepareExecution(
    scriptContent,
    manifestContent
  );

  const spinner = ora({
    text: 'Executing the script',
    spinner: DEFAULT_SPINNER,
  }).start();
  const results = await executeScript(
    scriptExecution.sql,
    scriptExecution.queryArguments,
    process.env['TOAST_ENV'] == 'prod' ? 'prod' : 'preprod',
    scriptExecution.shards
  );
  spinner.stop();
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
