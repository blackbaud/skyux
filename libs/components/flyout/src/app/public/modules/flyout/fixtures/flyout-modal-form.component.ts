import {
  Component
} from '@angular/core';

import {
  SkyModalInstance
} from '@skyux/modals';

import {
  SkyFlyoutModalFixtureContext
} from './flyout-modal-context';

@Component({
  selector: 'sky-demo-modal-form',
  templateUrl: './flyout-modal-form.component.html'
})
export class SkyFlyoutModalFixtureFormComponent {
  public title = 'Hello world';

  constructor(
    public context: SkyFlyoutModalFixtureContext,
    public instance: SkyModalInstance
  ) { }
}
