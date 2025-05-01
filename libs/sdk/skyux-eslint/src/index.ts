import templateAll from './configs/template-all';
import templateRecommended from './configs/template-recommended';
import tsAll from './configs/ts-all';
import tsRecommended from './configs/ts-recommended';
import tsStrictTypeChecked from './configs/ts-strict-type-checked';
import templatePlugin from './plugins/template-plugin';
import tsPlugin from './plugins/ts-plugin';

const configs = {
  templateAll,
  templateRecommended,
  tsAll,
  tsRecommended,
  tsStrictTypeChecked,
};

const plugins = {
  templatePlugin,
  tsPlugin,
};

// ESM
export default {
  configs,
  plugins,
};

// CommonJS
export { configs, plugins };
