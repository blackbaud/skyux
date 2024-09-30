import { ESLintUtils } from '@typescript-eslint/utils';

export function createESLintRule(
  config: Readonly<
    ESLintUtils.RuleWithMetaAndName<readonly unknown[], string, unknown>
  >,
) {
  const ruleCreator = ESLintUtils.RuleCreator((ruleName) => {
    return `https://github.com/blackbaud/skyux/blob/main/libs/cdk/eslint-plugin-template/docs/rules/${ruleName}.md`;
  });

  return ruleCreator(config);
}
