import {
  Injectable
} from '@angular/core';

import {
  FooUser
} from './foo-user';

/**
 * This is the description for FooUserService.
 */
@Injectable()
export class FooUserService {

  /**
   * This is the description for createFoo(). It creates a [[FooUser]].
   */
  public getUsers(): FooUser[] {
    return [{
      firstName: 'John',
      lastName: 'Doe'
    }];
  }
}
