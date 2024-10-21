import templateAll from './configs/template-all';
import templateRecommended from './configs/template-recommended';
import tsAll from './configs/ts-all';
import tsRecommended from './configs/ts-recommended';

const configs = {
  templateAll,
  templateRecommended,
  tsAll,
  tsRecommended,
};

// ESM
export default {
  configs,
};

// CommonJS
export { configs };
