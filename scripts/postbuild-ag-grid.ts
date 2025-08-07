import path from 'path';

import { renderScss } from './utils/render-scss';

const STYLES_ROOT = path.resolve(
  __dirname,
  '../libs/components/ag-grid/src/lib/styles',
);
const DEST_ROOT = path.resolve(__dirname, '../dist/libs/components/ag-grid');

async function copyScss(): Promise<void> {
  const target = path.join(DEST_ROOT, 'css/sky-ag-grid.css');

  await renderScss(path.join(STYLES_ROOT, 'ag-grid-styles.scss'), target);
}

async function postBuildAgGrid(): Promise<void> {
  console.log('Running @skyux/ag-grid postbuild step...');
  try {
    await copyScss();

    console.log('Done running @skyux/ag-grid postbuild.');
  } catch (err) {
    console.error('[postbuild-ag-grid error]', err);
    process.exit(1);
  }
}

void postBuildAgGrid();
