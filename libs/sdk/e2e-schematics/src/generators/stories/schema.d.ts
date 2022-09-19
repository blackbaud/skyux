export interface StoriesGeneratorSchema {
  project?: string;
  cypressProject?: string;
  generateCypressSpecs: boolean;
  paths?: string[];
}
