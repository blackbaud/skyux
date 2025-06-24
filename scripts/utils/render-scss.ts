import fs from 'fs-extra';
import sass from 'sass';

export async function renderScss(
  scssFilePath: string,
  cssDestPath: string,
): Promise<void> {
  const result = await sass.compileAsync(scssFilePath, {
    loadPaths: ['./', 'node_modules'],
  });

  fs.ensureFileSync(cssDestPath);
  fs.writeFileSync(cssDestPath, result.css);
}
