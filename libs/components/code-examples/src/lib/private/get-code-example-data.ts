import { Type } from '@angular/core';

import codeExamplesJson from './code-examples.json';

interface CodeExample {
  files: Record<string, string>;
  importPath: string;
  primaryFile: string;
}

const CODE_EXAMPLES = codeExamplesJson as Record<string, CodeExample>;

export interface SkyCodeExampleData {
  componentName: string;
  componentType: Type<unknown>;
  files: Record<string, string>;
  importPath: string;
  primaryFile: string;
}

export async function getCodeExampleData(
  componentName: string,
): Promise<SkyCodeExampleData> {
  const example = CODE_EXAMPLES[componentName];

  const moduleExports = (await import(example.importPath)) as unknown as Record<
    string,
    Type<unknown>
  >;

  const componentType = moduleExports[componentName];

  return { ...example, componentName, componentType };
}
