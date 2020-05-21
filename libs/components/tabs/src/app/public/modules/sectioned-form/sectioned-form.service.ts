import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

@Injectable()
export class SkySectionedFormService {

  public requiredChange: BehaviorSubject<boolean> = new BehaviorSubject(undefined);
  public invalidChange: BehaviorSubject<boolean> = new BehaviorSubject(undefined);

  public requiredFieldChanged(isRequired: boolean): void {
    this.requiredChange.next(isRequired);
  }

  public invalidFieldChanged(isInvalid: boolean): void {
    this.invalidChange.next(isInvalid);
  }
}
