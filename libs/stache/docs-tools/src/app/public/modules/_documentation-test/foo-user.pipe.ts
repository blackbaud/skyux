import {
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  FooUser
} from './foo-user';

/**
 * This is the description for the FooUserPipe.
 * @example
 * ```
 * <input value="value | fooUser">
 * ```
 */
@Pipe({
  name: 'fooUser'
})
export class FooUserPipe implements PipeTransform {

  /**
   * This will transform a user.
   * @param value The user to transform.
   * @example
   * ```
   * fooUserPipe.transform(myUser);
   * ```
   */
  public transform(value: FooUser): string {
    return `${value.firstName} ${value.lastName}`;
  }

}
