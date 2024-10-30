import { ESLintUtils } from '@typescript-eslint/utils';

export function createESLintRule(
  config: Readonly<
    ESLintUtils.RuleWithMetaAndName<readonly unknown[], string, unknown>
  >,
): ESLintUtils.RuleModule<
  string,
  readonly unknown[],
  unknown,
  ESLintUtils.RuleListener
> {
  const ruleCreator = ESLintUtils.RuleCreator((ruleName) => {
    return `https://github.com/blackbaud/skyux/blob/main/libs/cdk/skyux-eslint/docs/rules/${ruleName}.md`;
  });

  return ruleCreator(config);
}
