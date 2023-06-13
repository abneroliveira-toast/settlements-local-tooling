

import * as fs from 'fs/promises';
import { ManifestFileContent, ScriptFileContent } from './prepare-execution.js';

export async function readFileContent(filePath: string): Promise<{scriptContent: ScriptFileContent, manifestContent: ManifestFileContent}> {
    const manifestFile = filePath.replace(new RegExp("\\\.sql", "gi"), '.yaml');
    return {
        scriptContent: (await fs.readFile(filePath, 'utf-8')),
        manifestContent: (await fs.readFile(manifestFile, 'utf-8'))
    }
}