import templateAll from './configs/template-all';
import templateRecommended from './configs/template-recommended';
import tsAll from './configs/ts-all';
import tsRecommended from './configs/ts-recommended';
import templatePlugin from './plugins/template-plugin';
import tsPlugin from './plugins/ts-plugin';

const configs = {
  templateAll,
  templateRecommended,
  tsAll,
  tsRecommended,
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
