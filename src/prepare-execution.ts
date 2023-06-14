import { parse } from "yaml";
import inquirer from "inquirer";
import {
  ScriptFileContent,
  ManifestFileContent,
  ScriptToRun,
  ScriptManifest,
  ScriptArgument,
} from "./types.js";

export async function prepareExecution(
  scriptFileContent: ScriptFileContent,
  manifestContent: ManifestFileContent
): Promise<ScriptToRun> {
  const scriptManifest = parse(manifestContent) as ScriptManifest;
  console.log(scriptManifest);
  return promptExecutionConfirmation(scriptFileContent, scriptManifest);
}

async function promptExecutionConfirmation(
  sql: ScriptFileContent,
  scriptManifest: ScriptManifest
): Promise<ScriptToRun> {
  const queryArguments = await Promise.all(scriptManifest.arguments.map(
    promptForArgument
  ));
  return {
    sql,
    queryArguments
  };
}
async function promptForArgument(
  scriptArgument: ScriptArgument
): Promise<string> {
  return (
    await inquirer.prompt<{ argumentValue: string }>([
      {
        type: scriptArgument.type,
        name: "argumentValue",
        message:
          scriptArgument.promptText ||
          `Inform the value for argument ${scriptArgument.name}`,
      },
    ])
  ).argumentValue;
}
