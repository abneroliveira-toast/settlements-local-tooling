import inquirer from 'inquirer';
import chalk from 'chalk';
import * as path from 'path';
import { spawn } from 'child_process';
import { chooseScriptToRun } from './choose-script-to-run.js';
import { getAvailableScripts } from './get-available-scripts.js';
import { prepareExecution } from './prepare-execution.js';
import { readFileContent } from './read-file-content.js';
import { executeScript } from './execute-script.js';
import ora, { Ora, spinners } from 'ora';
import { DEFAULT_SPINNER, SCRIPTS_FOLDERS } from './constants.js';
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
  const scriptChosenFile = nameScriptToRun;
  const { scriptContent, manifestContent } = await readFileContent(
    scriptChosenFile.path
  );
  console.log(chalk.bold('SCRIPT: ', nameScriptToRun));
  console.log(`===================================================================================

${highlight(scriptContent)}

===================================================================================`);

  if (scriptChosenFile.name.endsWith('.sql')) {
    const scriptToRun = await prepareExecution(scriptContent, manifestContent);

    const spinner = ora({
      text: 'Executing the script',
      spinner: DEFAULT_SPINNER,
    }).start();
    const results = await executeScript(scriptToRun);
    spinner.stop();
    await writeResults(nameScriptToRun.name, results);
    for (let result of results) {
      console.log(chalk.bold(`RESULT FOR SHARD: ${result.shard}`));
      if ('data' in result) {
        console.table(result.data);
      } else {
        console.error(chalk.redBright(`ERROR: ${result.error}`));
      }
    }
  } else if (scriptChosenFile.name.endsWith('.ts')) {
    const result = await cmd(
      `node`,
      '--loader',
      '@swc-node/register/esm',
      scriptChosenFile.path
    );
    console.log(`RESULT from spawned script ... \n${result}`);
  } else {
    const result = await cmd(`node`, scriptChosenFile.path);
    console.log(`RESULT from spawned script ... \n${result}`);
  }
} catch (e) {
  spinner?.stop();
  console.error(
    chalk.bold.red(`Failed to execute script:
        $${e}
    `)
  );
}

function cmd(...command: string[]) {
  let p = spawn(command[0], command.slice(1), { stdio: 'inherit' });
  return new Promise<string>((resolveFunc, rejectFunc) => {
    let data: string = '';
    let err: string | null;
    p.stdout?.on('data', (x) => {
      data += x.toString();
      //process.stdout.write(x.toString());
    });
    p.stderr?.on('data', (x) => {
      err += x.toString();
      //process.stderr.write(x.toString());
    });
    p.on('exit', (code) => {
      //if (err == null) {
      if (code == 0) {
        resolveFunc(data);
      } else {
        rejectFunc(new Error(`Program exit with code :${code}`));
      }
      // } else {
      //   rejectFunc(new Error(err));
      // }
    });
  });
}
