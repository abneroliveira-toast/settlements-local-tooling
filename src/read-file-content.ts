import * as fs from 'fs/promises';
import { ManifestFileContent, ScriptFileContent } from './types.js';
import { SQL_EXTENSION_REGEXP } from './constants.js';

export async function readFileContent(filePath: string): Promise<{
  scriptContent: ScriptFileContent;
  manifestContent: ManifestFileContent;
}> {
  const manifestFile = filePath.replace(SQL_EXTENSION_REGEXP, '.yaml');
  return {
    scriptContent: await fs.readFile(filePath, 'utf-8'),
    manifestContent: await fs.readFile(manifestFile, 'utf-8'),
  };
}
