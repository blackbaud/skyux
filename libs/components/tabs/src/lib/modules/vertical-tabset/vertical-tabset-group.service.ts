import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyVerticalTabsetGroupMessage } from './vertical-tabset-group-message';

/**
 * @internal
 */
@Injectable()
export class SkyVerticalTabsetGroupService {
  public messageStream = new Subject<SkyVerticalTabsetGroupMessage>();
}
