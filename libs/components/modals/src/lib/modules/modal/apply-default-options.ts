import { SkyModalConfigurationInterface } from './modal.interface';

/**
 * Returns modal options with defaults applied.
 * @internal
 */
export function applyDefaultOptions(
  providersOrConfig: SkyModalConfigurationInterface | any[] | undefined,
): SkyModalConfigurationInterface {
  const defaultParams: SkyModalConfigurationInterface = {
    providers: [],
    fullPage: false,
    size: 'medium',
    tiledBody: false,
  };

  let params: SkyModalConfigurationInterface = {};

  // Object Literal Lookup for backwards compatibility.
  const method = {
    'providers?': Object.assign({}, defaultParams, {
      providers: providersOrConfig,
    }),
    config: Object.assign({}, defaultParams, providersOrConfig),
  };

  if (Array.isArray(providersOrConfig) === true) {
    params = method['providers?'];
  } else {
    params = method['config'];
  }

  return params;
}
