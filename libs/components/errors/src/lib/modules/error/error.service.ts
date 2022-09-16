import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

/**
 * internal
 */
@Injectable()
export class SkyErrorService {
  public replaceDefaultDescription = new BehaviorSubject<boolean>(false);
  public replaceDefaultTitle = new BehaviorSubject<boolean>(false);
}
