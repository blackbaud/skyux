import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HelpWidgetConfig } from './widget-config';

@Injectable()
export abstract class InitializationConfigExtensionService {
  public abstract extend(
    config: HelpWidgetConfig
  ): Observable<HelpWidgetConfig>;
}
