import { normalize } from '@angular-devkit/core';
import {
  MergeStrategy,
  Rule,
  apply,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';

export function addAiSkills(): Rule {
  return mergeWith(
    apply(url('./files'), [move(normalize('.github'))]),
    MergeStrategy.Overwrite,
  );
}
export default addAiSkills;
