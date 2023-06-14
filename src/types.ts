export type EnvName = 'prod' | 'preprod';

export type shardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ScriptSuccessResult = { shard: number, data: any[]}
export type ScriptFailureResult = { shard: number, error: string}
export type ScriptResult = ScriptFailureResult | ScriptSuccessResult;


/**
 * Object with the script which will be executed and the arguments which will be passed
 * into the sql script
 */
export type ScriptToRun = {
  sql: string;
  queryArguments: string[];
};

/**
 * Represents an argument for a script
 */
export type ScriptArgument = {
  name: string;
  validator?: string;
  promptText?: string;
  type: 'input' | 'number' | 'password'
};

/**
 * Represents a manifest to a script which will be executed
 */
export type ScriptManifest = {
  description: string;
  multiShard: boolean;
  aggregateResult: boolean;
  arguments: ScriptArgument[];
};

/** 
 * Script content - at this moment is only an alias to the string
 * but having it type aliased would facilitate the type renaming if it is going to 
 * be translated to other complex type
 */
export type ScriptFileContent = string;

/** 
 * Manifest content - at this moment is only an alias to the string
 * but having it type aliased would facilitate the type renaming if it is going to 
 * be translated to other complex type
 */
export type ManifestFileContent = string;
