export type ScriptToRun = {
  sql: string;
  arguments: string[];
};

export type ScriptArgument = {
  name: string;
  validator?: string;
  promptText?: string;
};

export type ScriptManifest = {
  description: string;
  multiShard: boolean;
  aggregateResult: boolean;
  arguments: ScriptArgument[];
};

export type ScriptFileContent = string;
export type ManifestFileContent = string;
