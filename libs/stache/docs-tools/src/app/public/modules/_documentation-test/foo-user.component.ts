import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import {
  FooUser
} from './foo-user';

/**
 * This is the description for FooUserComponent.
 */
@Component({
  selector: 'app-foo-user',
  template: ''
})
export class FooUserComponent implements OnInit {

  /**
   * The user, which is a [[FooUser]] value.
   */
  @Input()
  public user: FooUser;

  @Output()
  public save = new EventEmitter<FooUser>();

  public ngOnInit(): void { }

  /**
   * Gets a user from the database.
   * @param id The unique identifier.
   * @param locale The locale of the user.
   */
  public getUserById(id: FooUser, locale: string = 'en-US'): FooUser {
    return {
      firstName: 'John',
      lastName: 'Doe'
    };
  }

}
