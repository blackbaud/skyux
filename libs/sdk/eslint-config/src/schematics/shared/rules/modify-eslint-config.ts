import { Rule } from "@angular-devkit/schematics";
import { readRequiredFile } from "../utility/tree";

export function modifyEsLintConfig(): Rule {
  return async (tree) => {
    const esLintConfig = readRequiredFile(tree, '.eslintrc.json');
    const esLintConfig = JSON.parse(esLintConfig);
  };
}
