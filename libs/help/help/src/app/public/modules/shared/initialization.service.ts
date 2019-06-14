import {
  Injectable
} from '@angular/core';

import {
  BBHelpClient
} from '@blackbaud/help-client';

import {
  HelpWidgetConfig
} from './widget-config';

@Injectable()
export class HelpInitializationService {
  public load(config: HelpWidgetConfig) {
      return BBHelpClient.load(config);
  }
}
