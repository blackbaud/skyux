import { Component, input, model } from '@angular/core';

import { Subject } from 'rxjs';

import { SkyBackToTopMessage } from '../models/back-to-top-message';
import { SkyBackToTopOptions } from '../models/back-to-top-options';

@Component({
  selector: 'sky-back-to-top-fixture',
  templateUrl: './back-to-top.component.fixture.html',
  standalone: false,
})
export class SkyBackToTopFixtureComponent {
  public height = input<number | undefined>(undefined);

  public hideElement = input<boolean>(false);

  public hideParent = input<boolean>(false);

  public scrollableParent = input<boolean>(false);

  public backToTopController = model<Subject<SkyBackToTopMessage>>(
    new Subject<SkyBackToTopMessage>(),
  );

  public backToTopOptions = model<SkyBackToTopOptions | undefined>({
    buttonHidden: false,
  });
}
