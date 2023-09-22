export interface CodeExampleSpaGeneratorSchema {
  path: string;
  ltsBranch: string;
  skipFormat: boolean;
}

export interface CodeExampleSpaGeneratorConfig
  extends CodeExampleSpaGeneratorSchema {
  project: string;
  projectPath: string;
}
