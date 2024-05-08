import { InjectionToken } from '@angular/core';

import { SkyHelpGlobalOptions } from './help-global-options';

/**
 * Injection token for specifying and retrieving global help options.
 */
export const SKY_HELP_GLOBAL_OPTIONS = new InjectionToken<SkyHelpGlobalOptions>(
  'SkyHelpGlobalOptions',
);
