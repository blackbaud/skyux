import { readFile, writeFile } from 'fs-extra';
import glob from 'glob';
import { join } from 'path';

const REPLACEMENT = `declare const require: any;

// Fix for crossvent "global is not defined" error. The crossvent library
// is used by Dragula, which in turn is used by multiple SKY UX components.
// See: https://github.com/bevacqua/dragula/issues/602
(window as any).global = window;`;

export async function fixCrossvent() {
  const testFiles = glob.sync('**/test.ts', { nodir: true });
  for (const testFile of testFiles) {
    const filePath = join(process.cwd(), testFile);
    let contents = (await readFile(filePath)).toString();
    contents = contents.replace('declare const require: any;', REPLACEMENT);
    await writeFile(filePath, contents);
  }
}
