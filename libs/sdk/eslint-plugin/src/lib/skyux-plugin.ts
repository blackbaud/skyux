import all from './configs/all.json';
import skyNoId, { RULE_NAME as skyNoIdRuleName } from './rules/sky-no-id';

const skyuxPlugin = {
  meta: {
    name: '@skyux-sdk/eslint-plugin',
    version: '0.0.0-PLACEHOLDER',
  },
  configs: {
    all,
  },
  rules: {
    [skyNoIdRuleName]: skyNoId,
  },
  // processors: {},
};

export default skyuxPlugin;
