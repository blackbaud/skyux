import { readFile, writeFile } from 'fs-extra';
import glob from 'glob';
import { join } from 'path';

export async function fixSchematicsTestScaffolding() {
  const testFiles = glob.sync('**/testing/scaffold.ts', { nodir: true });
  for (const testFile of testFiles) {
    const filePath = join(process.cwd(), testFile);
    let contents = (await readFile(filePath)).toString();
    contents = contents
      .replace(/version: '12'/g, "version: '13'")
      .replace(/legacyBrowsers: true,/, '');
    await writeFile(filePath, contents);
  }
}
