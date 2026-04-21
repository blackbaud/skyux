import templateAll from './configs/template-all';
import templateExperimental from './configs/template-experimental';
import templateRecommended from './configs/template-recommended';
import tsAll from './configs/ts-all';
import tsExperimental from './configs/ts-experimental';
import tsRecommended from './configs/ts-recommended';
import templatePlugin from './plugins/template-plugin';
import tsPlugin from './plugins/ts-plugin';

const configs = {
  templateAll,
  templateExperimental,
  templateRecommended,
  tsAll,
  tsExperimental,
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
