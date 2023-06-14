import { parse } from "yaml";
import * as inquirer from "inquirer";
import {
  ScriptFileContent,
  ManifestFileContent,
  ScriptToRun,
  ScriptManifest,
} from "./types.js";

export async function prepareExecution(
  scriptFileContent: ScriptFileContent,
  manifestContent: ManifestFileContent
): Promise<ScriptToRun> {
  const scriptManifest = parse(manifestContent) as ScriptManifest;
  console.log(scriptManifest);
  return promptExecutionConfirmation(scriptManifest);
}

async function promptExecutionConfirmation(
  scriptManifest: ScriptManifest
): Promise<ScriptToRun> {
  return {
    sql: `SELECT sum(amount) FROM "RestaurantDailySettlement" rds 
        where rds."date_timestampYyyymmdd" = $1;
        `,
    arguments: ["20230613"],
  };
}
