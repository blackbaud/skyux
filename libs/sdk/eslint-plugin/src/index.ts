import {
  noUnboundId,
  RULE_NAME as noUnboundIdRuleName,
} from './lib/rules/template/no-unbound-id';
import processors from './processors';

export = {
  configs: {},
  processors,
  rules: {
    [noUnboundIdRuleName]: noUnboundId,
  },
};
