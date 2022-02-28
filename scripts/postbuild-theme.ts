import fs from 'fs-extra';
import tildeImporter from 'node-sass-tilde-importer';
import path from 'path';
import sass from 'sass';

const STYLES_ROOT = path.resolve(
  __dirname,
  '../libs/components/theme/src/lib/styles'
);
const DEST_ROOT = path.resolve(__dirname, '../dist/libs/components/theme');

const skyScssPath = path.join(STYLES_ROOT, 'sky.scss');

function validateSkyuxIconVersionMatch() {
  console.log('Validating SKY UX icon font version...');

  const scssContents = fs.readFileSync(skyScssPath, 'utf8').toString();

  const packageJson = fs.readJsonSync(
    path.resolve(__dirname, '../libs/components/theme/package.json')
  );

  const scssVersionMatches = scssContents.match(
    /@import url\('https:\/\/sky\.blackbaudcdn\.net\/static\/skyux-icons\/([A-z0-9\-.]+)\/assets\/css\/skyux-icons\.min\.css'\)/
  );

  if (!scssVersionMatches || scssVersionMatches.length !== 2) {
    console.error('Could not find the SKY UX icon font version in sky.scss.');
    process.exit(1);
  }

  const scssVersion = scssVersionMatches[1];

  const packageVersion = packageJson.dependencies['@skyux/icons'];
  if (!packageVersion) {
    console.error('Could not find the @skyux/icons dependency in package.json');
    process.exit(1);
  }

  if (scssVersion !== packageVersion) {
    console.error(
      'sky.scss references SKY UX icon font version ' +
        scssVersion +
        ', but package.json references @skyux/icons version ' +
        packageVersion +
        '. These versions should match.'
    );
    process.exit(1);
  }

  console.log('Done.');
}

function renderScss(file: string, target: string) {
  const result = sass.renderSync({
    file: file,
    importer: tildeImporter,
    quietDeps: true,
  });

  fs.ensureFileSync(target);
  fs.writeFileSync(target, result.css);
}

function copyScss() {
  console.log('Preparing SCSS and CSS files...');

  renderScss(skyScssPath, path.join(DEST_ROOT, 'css/sky.css'));

  renderScss(
    path.join(STYLES_ROOT, 'themes/modern/styles.scss'),
    path.join(DEST_ROOT, 'css/themes/modern/styles.css')
  );

  console.log('Done.');
}

function copyDesignTokens() {
  console.log('Copying design tokens...');

  fs.copySync(
    path.join(STYLES_ROOT, '_mixins-public.scss'),
    path.join(DEST_ROOT, 'scss/mixins.scss')
  );

  fs.copySync(
    path.join(STYLES_ROOT, '_variables-public.scss'),
    path.join(DEST_ROOT, 'scss/variables.scss')
  );

  console.log('Done.');
}

function copyCompatMixins() {
  console.log('Copying compatibility mixins...');

  fs.copySync(
    path.join(STYLES_ROOT, '_compat'),
    path.join(DEST_ROOT, 'scss/_compat')
  );

  fs.copySync(
    path.join(STYLES_ROOT, 'themes/modern/_compat'),
    path.join(DEST_ROOT, 'scss/themes/modern/_compat')
  );

  console.log('Done.');
}

function postBuildTheme() {
  console.log('Running @skyux/theme postbuild step...');
  try {
    validateSkyuxIconVersionMatch();
    copyScss();
    copyDesignTokens();
    copyCompatMixins();

    console.log('Done running @skyux/theme postbuild.');
  } catch (err) {
    console.error('[postbuild-theme error]', err);
    process.exit(1);
  }
}

postBuildTheme();
