import { Injectable } from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

@Injectable()
export class SkyDefinitionListService {
  public labelWidth = new BehaviorSubject<string>('');

  public defaultValue = new BehaviorSubject<string>('');
}
