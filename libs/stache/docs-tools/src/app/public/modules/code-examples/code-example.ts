import {
  SkyDocsSourceCodeFile
} from '../source-code/source-code-file';

import {
  SkyDocsCodeExampleModuleDependencies
} from './code-example-module-dependencies';

export interface SkyDocsCodeExample {

  title: string;

  sourceCode: SkyDocsSourceCodeFile[];

  packageDependencies: SkyDocsCodeExampleModuleDependencies;

}
