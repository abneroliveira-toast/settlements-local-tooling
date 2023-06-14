export type ScriptToRun = {
  sql: string;
  queryArguments: string[];
};

export type ScriptArgument = {
  name: string;
  validator?: string;
  promptText?: string;
  type: 'input' | 'number' | 'password'
};

export type ScriptManifest = {
  description: string;
  multiShard: boolean;
  aggregateResult: boolean;
  arguments: ScriptArgument[];
};

export type ScriptFileContent = string;
export type ManifestFileContent = string;
