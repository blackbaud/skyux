import {
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  FooUser
} from './foo-user';

/**
 * This is the description for the FooUserPipe.
 */
@Pipe({
  name: 'fooUser'
})
export class FooUserPipe implements PipeTransform {

  public transform(value: FooUser): string {
    return `${value.firstName} ${value.lastName}`;
  }

}
