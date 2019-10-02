import {
  SkyDocsSourceCodeFile
} from '../source-code/source-code-file';

import {
  SkyDocsCodeExampleModuleDependencies
} from './code-example-module-dependencies';

export interface SkyDocsCodeExample {

  heading: string;

  sourceCode: SkyDocsSourceCodeFile[];

  packageDependencies: SkyDocsCodeExampleModuleDependencies;

}
