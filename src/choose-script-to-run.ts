import inquirer from 'inquirer';
import * as path from 'path';
import { ScriptList, ScriptChosen } from './types.js';
import {
  ScriptNameAndPath,
  ScriptNameAndPathArray,
} from './get-available-scripts.js';

export async function chooseScriptToRun(
  availableScripts: ScriptNameAndPathArray
): Promise<ScriptNameAndPath> {
  let fileChosen = (
    await inquirer.prompt<{ scriptName: string }>({
      type: 'list',
      name: 'scriptName',
      message: 'Hi dear Engineer, which script do you want me to run today?\n',
      choices: availableScripts.map((f) => f.name),
    })
  ).scriptName;

  return availableScripts.filter((f) => f.name == fileChosen)[0];
}
