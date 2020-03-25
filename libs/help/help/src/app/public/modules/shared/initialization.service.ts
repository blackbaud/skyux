import {
  Injectable,
  Optional
} from '@angular/core';

import {
  BBHelpClient
} from '@blackbaud/help-client';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  HelpWidgetConfig
} from './widget-config';

import {
  InitializationConfigExtensionService
} from './initialization-config-extension.service';

import {
  Observable,
  of
} from 'rxjs';

@Injectable()
export class HelpInitializationService {
  public constructor(
    private windowRef: SkyAppWindowRef,
    private config: SkyAppConfig,
    @Optional() private configExtensionService: InitializationConfigExtensionService = undefined
  ) { }

  public load(config: HelpWidgetConfig = {}): Promise<void> {
    if (this.config.runtime.params.has('svcid')) {
      config.extends = this.config.runtime.params.get('svcid');
    }

    if (this.config.runtime.params.has('envid')) {
      config.environmentId = this.config.runtime.params.get('envid');
    }

    const skyuxHost = this.windowRef.nativeWindow.SKYUX_HOST;
    if (skyuxHost && !config.locale) {
      const languages = skyuxHost.acceptLanguage || '';
      config.locale = languages.split(',')[0];
    }
    const configObservable: Observable<HelpWidgetConfig> = this.configExtensionService
      ? this.configExtensionService.extend(config)
      : of(config);
    return configObservable.toPromise()
      .then((extendedConfig: HelpWidgetConfig) => BBHelpClient.load(extendedConfig));
  }
}
