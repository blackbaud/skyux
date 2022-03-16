import { SkyDocsSourceCodeFile } from '../source-code/source-code-file';

import { SkyDocsCodeExampleModuleDependencies } from './code-example-module-dependencies';
import { SkyDocsCodeExampleTheme } from './code-example-theme';

/**
 * @internal
 */
export interface SkyDocsCodeExample {
  heading: string;

  packageDependencies: SkyDocsCodeExampleModuleDependencies;

  sourceCode: SkyDocsSourceCodeFile[];

  theme: SkyDocsCodeExampleTheme;

  stylesheets?: string[];
}
