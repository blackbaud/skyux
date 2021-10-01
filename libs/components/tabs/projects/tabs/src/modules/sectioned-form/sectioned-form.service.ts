import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

@Injectable()
export class SkySectionedFormService {
/**
 * @internal
 */
  public invalidChange: BehaviorSubject<boolean> = new BehaviorSubject(undefined);
/**
 * @internal
 */
  public requiredChange: BehaviorSubject<boolean> = new BehaviorSubject(undefined);

  /**
   * Sets the current section's invalid state based on the `isInvalid` parameter.
   * This method is used within a `sky-sectioned-form-section` element.
   */
  public invalidFieldChanged(isInvalid: boolean): void {
    this.invalidChange.next(isInvalid);
  }

  /**
   * Sets the current section's required state based on the `isRequired` parameter.
   * This method is used within a `sky-sectioned-form-section` element.
   */
  public requiredFieldChanged(isRequired: boolean): void {
    this.requiredChange.next(isRequired);
  }
}
