import { normalize } from '@angular-devkit/core';
import {
  MergeStrategy,
  Rule,
  apply,
  filter,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';

export function addAiSkills(): Rule {
  return mergeWith(
    apply(url('./files'), [
      filter((path) => !path.includes('/evals/')),
      move(normalize('.github')),
    ]),
    MergeStrategy.Overwrite,
  );
}
export default addAiSkills;
