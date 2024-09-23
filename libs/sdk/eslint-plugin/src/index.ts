import templateAll from './configs/template-all.json';
import processors from './processors';
import {
  noUnboundId,
  RULE_NAME as noUnboundIdRuleName,
} from './rules/template/no-unbound-id';

export = {
  configs: {
    ['template-all']: templateAll,
  },
  processors,
  rules: {
    [`template/${noUnboundIdRuleName}`]: noUnboundId,
  },
};
