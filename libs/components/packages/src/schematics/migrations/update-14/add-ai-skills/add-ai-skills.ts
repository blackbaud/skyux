import { Rule, externalSchematic } from '@angular-devkit/schematics';

export default function addAiSkills(): Rule {
  return externalSchematic('@skyux/packages', 'add-ai-skills', {});
}
