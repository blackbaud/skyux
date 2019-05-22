import {
  SkyDocsCodeExampleSourceFile
} from './code-example-source-file';

export interface SkyDocsCodeExample {
  title: string;
  sourceFiles: SkyDocsCodeExampleSourceFile[];
}
