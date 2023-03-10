import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';

function copyFilesToDist() {
  const pathsToCopy = [
    ['collection.json'],
    ['/src/schematics/migrations/migration-collection.json'],
    ['/src/schematics/ng-generate/polyfills/schema.json'],
    ['/src/schematics/ng-add/schema.json'],
    ['/src/polyfills.js'],
  ];

  pathsToCopy.forEach((pathArr) => {
    const sourcePath = path.join(
      process.cwd(),
      'libs/components/packages',
      ...pathArr
    );
    const distPath = path.join(
      process.cwd(),
      'dist/libs/components/packages',
      ...pathArr
    );

    console.log(`Copying '${sourcePath.replace(process.cwd(), '')}'...`);

    if (fs.existsSync(sourcePath)) {
      fs.copySync(sourcePath, distPath);
      console.log(`Successfully copied ${sourcePath} to ${distPath}`);
    } else {
      throw new Error(`File not found: ${sourcePath}`);
    }
  });

  // Copy schematics templates.
  const templateFiles = glob.sync(
    'libs/components/packages/src/schematics/**/*.template',
    { nodir: true }
  );
  for (const templateFile of templateFiles) {
    fs.copySync(templateFile, path.join(process.cwd(), 'dist', templateFile));
  }
}

function postbuildPackages() {
  console.log('Running @skyux/packages postbuild step...');
  try {
    copyFilesToDist();
  } catch (err) {
    console.error('[postbuild-packages error]', err);
    process.exit(1);
  }
}

postbuildPackages();
