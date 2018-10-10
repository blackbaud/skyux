import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SkySectionedFormService {

  public requiredChange: BehaviorSubject<boolean> = new BehaviorSubject(undefined);
  public invalidChange: BehaviorSubject<boolean> = new BehaviorSubject(undefined);

  public requiredFieldChanged(required: boolean) {
    this.requiredChange.next(required);
  }

  public invalidFieldChanged(invalid: boolean) {
    this.invalidChange.next(invalid);
  }
}
