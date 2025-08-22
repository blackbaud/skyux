import fs from 'fs-extra';
import path from 'node:path';

import { renderScss } from './utils/render-scss';

const STYLES_ROOT = path.resolve(
  __dirname,
  '../libs/components/theme/src/lib/styles',
);

const DEST_ROOT = path.resolve(__dirname, '../dist/libs/components/theme');

const skyScssPath = path.join(STYLES_ROOT, 'sky.scss');

function addPackageExport(filePath: string): void {
  const rootRelativePath = filePath.replace(DEST_ROOT, '.').replace(/\\/g, '/');
  const filePathNoExtension = rootRelativePath.substring(
    0,
    rootRelativePath.lastIndexOf('.'),
  );

  const packageJsonPath = path.resolve(DEST_ROOT, 'package.json');
  const packageJson = fs.readJsonSync(packageJsonPath);

  packageJson.exports = packageJson.exports || {};
  packageJson.exports[filePathNoExtension] = {
    default: rootRelativePath,
  };
  packageJson.exports[rootRelativePath] = {
    default: rootRelativePath,
  };

  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
}

function validateSkyuxIconVersionMatch(): void {
  console.log('Validating SKY UX icon font version...');

  const scssContents = fs.readFileSync(skyScssPath, 'utf8').toString();

  const scssVersionMatches = scssContents.match(
    /@import url\('https:\/\/sky\.blackbaudcdn\.net\/static\/skyux-icons\/([A-z0-9\-.]+)\/assets\/css\/skyux-icons\.min\.css'\)/,
  );

  if (!scssVersionMatches || scssVersionMatches.length !== 2) {
    throw new Error('Could not find the SKY UX icon font version in sky.scss.');
  }

  const scssVersion = scssVersionMatches[1];

  const packageJsonPath = path.resolve(
    __dirname,
    '../libs/components/theme/package.json',
  );
  const packageJson = fs.readJsonSync(packageJsonPath);

  const packageVersion = packageJson.dependencies['@skyux/icons'];
  if (!packageVersion) {
    throw new Error(
      'Could not find the @skyux/icons dependency in package.json',
    );
  }

  if (scssVersion !== packageVersion) {
    throw new Error(
      'sky.scss references SKY UX icon font version ' +
        scssVersion +
        ', but package.json references @skyux/icons version ' +
        packageVersion +
        '. These versions should match.',
    );
  }

  console.log('Done.');
}

async function compileScss(): Promise<void> {
  console.log('Preparing SCSS and CSS files...');

  const skyCssDest = path.join(DEST_ROOT, 'css/sky.css');
  const modernScssPath = path.join(STYLES_ROOT, 'themes/modern/styles.scss');
  const modernCssDest = path.join(DEST_ROOT, 'css/themes/modern/styles.css');

  await renderScss(skyScssPath, skyCssDest);
  addPackageExport(skyCssDest);

  await renderScss(modernScssPath, modernCssDest);
  addPackageExport(modernCssDest);

  console.log('Done.');
}

function copyScss(sourcePath: string, destPath: string): void {
  fs.copySync(sourcePath, destPath);
  addPackageExport(destPath);
}

function copyPublicScssFiles(): void {
  console.log('Copying public SCSS files...');

  copyScss(
    path.join(STYLES_ROOT, '_public-api/_component-theme.scss'),
    path.join(DEST_ROOT, 'scss/component-theme.scss'),
  );

  copyScss(
    path.join(STYLES_ROOT, '_public-api/_mixins.scss'),
    path.join(DEST_ROOT, 'scss/mixins.scss'),
  );

  copyScss(
    path.join(STYLES_ROOT, '_public-api/_responsive.scss'),
    path.join(DEST_ROOT, 'scss/responsive.scss'),
  );

  copyScss(
    path.join(STYLES_ROOT, '_public-api/_variables.scss'),
    path.join(DEST_ROOT, 'scss/variables.scss'),
  );

  console.log('Done.');
}

function copyCompatScssFiles(): void {
  console.log('Copying compatibility SCSS files...');

  copyScss(
    path.join(STYLES_ROOT, '_public-api/_compat/_variables.scss'),
    path.join(DEST_ROOT, 'scss/_compat/_variables.scss'),
  );

  copyScss(
    path.join(STYLES_ROOT, '_public-api/_compat/_mixins.scss'),
    path.join(DEST_ROOT, 'scss/_compat/_mixins.scss'),
  );

  copyScss(
    path.join(STYLES_ROOT, '_public-api/themes/modern/_compat/_variables.scss'),
    path.join(DEST_ROOT, 'scss/themes/modern/_compat/_variables.scss'),
  );

  copyScss(
    path.join(STYLES_ROOT, '_public-api/themes/modern/_compat/_mixins.scss'),
    path.join(DEST_ROOT, 'scss/themes/modern/_compat/_mixins.scss'),
  );

  console.log('Done.');
}

async function postBuildTheme(): Promise<void> {
  console.log('Running @skyux/theme postbuild step...');
  try {
    validateSkyuxIconVersionMatch();
    await compileScss();
    copyPublicScssFiles();
    copyCompatScssFiles();

    console.log('Done running @skyux/theme postbuild.');
  } catch (err) {
    console.error('[postbuild-theme error]', err);
    process.exit(1);
  }
}

void postBuildTheme();
