import stylelint from 'stylelint';

export function getRuleMeta(args: {
  fixable?: boolean;
  ruleId: string;
}): stylelint.RuleMeta {
  const { fixable, ruleId } = args;

  return {
    fixable,
    url: `https://github.com/blackbaud/skyux/blob/main/libs/cdk/skyux-stylelint/docs/rules/${ruleId}.md`,
  } satisfies stylelint.RuleMeta;
}
