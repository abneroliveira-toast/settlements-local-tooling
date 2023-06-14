
import {parse} from 'yaml';
import * as inquirer from 'inquirer';

export type ScriptToRun = {
    sql: string,
    arguments: string[]
}

export type ScriptArgument = {
    name: string,
    validator?: string,
    promptText?: string
}

export type ScriptManifest = {
    description: string,
    multiShard: boolean,
    aggregateResult: boolean,
    arguments: ScriptArgument[]
}

export type ScriptFileContent = string;
export type ManifestFileContent = string;

export async function prepareExecution(scriptFileContent: ScriptFileContent, manifestContent: ManifestFileContent): Promise<ScriptToRun> {
    const scriptManifest = parse(manifestContent) as ScriptManifest;
    console.log(scriptManifest)
    return promptExecutionConfirmation(scriptManifest);
}





async function promptExecutionConfirmation(scriptManifest: ScriptManifest): Promise<ScriptToRun> {
    return {
        sql: `SELECT sum(amount) FROM "RestaurantDailySettlement" rds 
        where rds."date_timestampYyyymmdd" = $1;
        `,
        arguments: ['20230613']
    };
}