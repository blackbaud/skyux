import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import { FooUser } from './foo-user';

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

  public ngOnInit(): void { }
}
