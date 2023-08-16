import * as path from 'path';
import * as fs from 'fs/promises';
import { SCRIPTS_FOLDERS } from './constants.js';

export type ScriptNameAndPath = { name: string; path: string };
export type ScriptNameAndPathArray = ScriptNameAndPath[];

const sqlFileRegex = new RegExp('.(sql|ts|js)$');
export async function getAvailableScripts(): Promise<ScriptNameAndPathArray> {
  const currentDir = process.cwd();
  let paths: ScriptNameAndPathArray = [];
  for (let scriptsRelativePath of SCRIPTS_FOLDERS) {
    const scriptsPath = path.resolve(currentDir, scriptsRelativePath);

    const filesInFolder = (
      await fs.readdir(scriptsPath, { withFileTypes: true })
    ).map((dirent) => ({
      name: dirent.name,
      path: path.join(scriptsPath, dirent.name),
    }));

    console.debug('FILES IN FOLDER', filesInFolder);

    paths = [
      ...paths,
      ...filesInFolder.filter((filenameAndPath) =>
        sqlFileRegex.test(filenameAndPath.name)
      ),
    ];
  }
  return paths;
}
