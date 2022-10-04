import { Component } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyBackToTopMessage } from '../models/back-to-top-message';
import { SkyBackToTopOptions } from '../models/back-to-top-options';

@Component({
  selector: 'sky-back-to-top-fixture',
  templateUrl: './back-to-top.component.fixture.html',
})
export class SkyBackToTopFixtureComponent {
  public height: number | undefined;

  public hideElement = false;

  public hideParent = false;

  public scrollableParent = false;

  public backToTopController: Subject<SkyBackToTopMessage> = new Subject();

  public backToTopOptions: SkyBackToTopOptions | undefined = {
    buttonHidden: false,
  };
}
