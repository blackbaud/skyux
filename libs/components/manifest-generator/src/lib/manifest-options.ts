import type { ProjectDefinition } from './get-project-definitions.js';

export interface SkyManifestOptions {
  codeExamplesPackageName: string;
  outDir: string;
  projects: ProjectDefinition[];
}
