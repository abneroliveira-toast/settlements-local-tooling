import inquirer from "inquirer";
import chalk from "chalk";
import { chooseScriptToRun } from "./choose-script-to-run.js";
import { getAvailableScripts } from "./get-available-scripts.js";
import { prepareExecution } from "./prepare-execution.js";
import { readFileContent } from "./read-file-content.js";
import { executeScript } from "./execute-script.js";

console.clear();

const fgOrange = chalk.hex("#FFA500");
const bgOrange = chalk.bgHex("#FFA500");
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
console.log(subtitleStyle("        Payments Settlements Team         \n\n"));

try {
  const availableScripts = await getAvailableScripts();
  const scriptToRun = await chooseScriptToRun(availableScripts);
  console.log("script to run", scriptToRun);
  const { scriptContent, manifestContent } = await readFileContent(scriptToRun);
  const scriptExecution = await prepareExecution(
    scriptContent,
    manifestContent
  );
  const results = await executeScript(
    scriptExecution.sql,
    scriptExecution.queryArguments,
    process.env["TOAST_ENV"] == "prod" ? "prod" : "preprod",
    scriptExecution.shards
  );
  for (let result of results) {
    console.log(chalk.bold(`RESULT FOR SHARD: ${result.shard}`));
    if ("data" in result) {
      console.table(result.data);
    } else {
      console.error(chalk.redBright(`ERROR: ${result.error}`));
    }
  }
} catch (e) {
  console.error(
    chalk.bold.red(`Failed to execute script:
        $${e}
    `)
  );
}
