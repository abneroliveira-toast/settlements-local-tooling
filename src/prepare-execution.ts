import { parse } from 'yaml';
import inquirer from 'inquirer';
import {
  ScriptFileContent,
  ManifestFileContent,
  ScriptExecutionArguments,
  ScriptManifest,
  ScriptArgument,
} from './types.js';
import { validators } from './validators.js';

export async function prepareExecution(
  scriptFileContent: ScriptFileContent,
  manifestContent: ManifestFileContent
): Promise<ScriptExecutionArguments> {
  const scriptManifest = parse(manifestContent) as ScriptManifest;
  console.log(scriptManifest);
  return promptExecutionConfirmation(scriptFileContent, scriptManifest);
}

async function promptExecutionConfirmation(
  sql: ScriptFileContent,
  scriptManifest: ScriptManifest
): Promise<ScriptExecutionArguments> {
  const queryArguments = await Promise.all(
    scriptManifest.arguments.map(promptForArgument)
  );
  return {
    env: process.env['TOAST_ENV'] == 'prod' ? 'prod' : 'preprod',
    sql,
    queryArguments,
    shards: scriptManifest.shards,
    shardAsLastQueryArgument: !!scriptManifest.shardAsLastQueryArgument,
  };
}
async function promptForArgument(
  scriptArgument: ScriptArgument
): Promise<string> {
  const validator = scriptArgument.validator
    ? validators[scriptArgument.validator]
    : null;
  return (
    await inquirer.prompt<{ argumentValue: string }>([
      {
        type: scriptArgument.type,
        name: 'argumentValue',
        message:
          scriptArgument.promptText ||
          `Inform the value for argument ${scriptArgument.name}`,
        validate: validator,
      },
    ])
  ).argumentValue;
}
