export interface ComponentGeneratorSchema {
  name: string;
  module?: string;
  project?: string;
  cypressProject?: string;
  generateCypressSpecs: boolean;
}
