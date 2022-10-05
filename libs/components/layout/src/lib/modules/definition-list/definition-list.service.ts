import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

/**
 * @internal
 */
@Injectable()
export class SkyDefinitionListService {
  public labelWidth = new BehaviorSubject<string | undefined>('');

  public defaultValue = new BehaviorSubject<string | undefined>('');
}
