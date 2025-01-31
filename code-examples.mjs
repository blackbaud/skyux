import fsExtra from 'fs-extra';

await fsExtra.copy(
  'apps/code-examples/src/app/code-examples',
  'libs/components/code-examples/src/lib/modules',
);
