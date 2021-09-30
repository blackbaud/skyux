import {
  Component
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyBackToTopMessage
} from '../models/back-to-top-message';

import {
  SkyBackToTopOptions
} from '../models/back-to-top-options';

@Component({
  selector: 'sky-back-to-top-fixture',
  templateUrl: './back-to-top.component.fixture.html'
})
export class SkyBackToTopFixtureComponent {

  public height: number;

  public scrollableParent: boolean;

  public backToTopController: Subject<SkyBackToTopMessage> = new Subject();

  public backToTopOptions: SkyBackToTopOptions = {
    buttonHidden: false
  };
}
