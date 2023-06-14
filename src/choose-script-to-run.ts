import inquirer from "inquirer";
import * as path from "path";
import { SCRIPTS_FOLDER } from "./constants.js";
import { ScriptList, ScriptChosen } from "./types.js";

export async function chooseScriptToRun(
  availableScripts: ScriptList
): Promise<ScriptChosen> {
  let fileChosen = (
    await inquirer.prompt<{ scriptName: string }>({
      type: "list",
      name: "scriptName",
      message: "Hi dear Engineer, which script do you want me to run today?\n",
      choices: availableScripts,
    })
  ).scriptName;

  return path.join(process.cwd(), SCRIPTS_FOLDER, fileChosen);
}
