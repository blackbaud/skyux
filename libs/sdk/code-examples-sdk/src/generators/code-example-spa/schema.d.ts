export interface CodeExampleSpaGeneratorSchema {
  component: string;
  path: string;
}

export interface CodeExampleSpaGeneratorConfig extends CodeExampleSpaGeneratorSchema {
  project: string;
  projectPath: string;
}
