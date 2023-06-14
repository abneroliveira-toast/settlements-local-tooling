import * as path from 'path';
import * as fs from 'fs/promises';
import { SCRIPTS_FOLDER } from './constants.js';

const sqlFileRegex = new RegExp('.sql$');
export async function getAvailableScripts(): Promise<string[]> {
  const currentDir = process.cwd();
  const scriptsPath = path.resolve(currentDir, SCRIPTS_FOLDER);

  const filesInFolder = (
    await fs.readdir(scriptsPath, { withFileTypes: true })
  ).map((dirent) => dirent.name);

  return filesInFolder.filter((fileName) => sqlFileRegex.test(fileName));
}
