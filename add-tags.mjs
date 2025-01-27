import fsPromises from 'node:fs/promises';

const manifest = JSON.parse(
  await fsPromises.readFile(
    'dist/libs/components/manifest/public-api.json',
    'utf-8',
  ),
);

for (const entries of Object.values(manifest.packages)) {
  for (const entry of entries) {
    if (entry.filePath.includes('/data-manager/')) {
      // console.log(entry.filePath);
      const contents = await fsPromises.readFile(entry.filePath, 'utf-8');
      await fsPromises.writeFile(
        entry.filePath,
        `@tags data-manager\n${contents}`,
      );
      // await fsPromises.appendFile(entry.filePath, `@tags data-manager\n`);
    }
  }
}

// import glob from 'fast-glob';

// const files = await glob('libs/components/**/*.ts', {
//   onlyFiles: true,
//   ignore: [
//     '**/*.spec.ts',
//     '**/fixtures/**',
//     '**/legacy/**',
//     '**/storybook/**',
//     '**/public-api.ts',
//     '**/index.ts',
//     '**/*-fixture.ts',
//     '**/*.fixture.ts',
//     'libs/components/manifest/**',
//     'libs/components/packages/**',
//   ],
// });

// for (const file of files) {
//   console.log(file);
// }
