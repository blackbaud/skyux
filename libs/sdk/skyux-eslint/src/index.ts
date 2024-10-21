import tsAll from './configs/ts-all';
import tsPlugin from './plugins/ts-plugin';

const configs = {
  tsAll: tsAll(tsPlugin),
};

// ESM
export default {
  configs,
};

// CommonJS
export { configs };
