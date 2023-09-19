export interface CodeExampleSpaGeneratorSchema {
  component: string;
  path: string;
  ltsBranch: string;
}

export interface CodeExampleSpaGeneratorConfig
  extends CodeExampleSpaGeneratorSchema {
  project: string;
  projectPath: string;
}
