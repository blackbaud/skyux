import { readFile, writeFile } from 'fs-extra';
import { join } from 'path';

const FIX = `/*eslint no-loss-of-precision: "warn"*/
/*eslint @typescript-eslint/no-loss-of-precision: "warn"*/
`;

export async function fixEslintNumericService() {
  const filePath = join(
    process.cwd(),
    'libs/components/core/src/lib/modules/numeric/numeric.service.spec.ts'
  );
  await writeFile(filePath, FIX + (await readFile(filePath)).toString());
}
