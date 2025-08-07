import { Component, Inject } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

import { SkyFlyoutModalFixtureContext } from './flyout-modal-context';
import { SKY_FLYOUT_MODAL_CONTEXT } from './flyout-modal-context-token';

@Component({
  selector: 'sky-demo-modal-form',
  templateUrl: './flyout-modal-form.component.html',
  standalone: false,
})
export class SkyFlyoutModalFixtureFormComponent {
  public title = 'Hello world';

  constructor(
    @Inject(SKY_FLYOUT_MODAL_CONTEXT)
    public context: SkyFlyoutModalFixtureContext,
    public instance: SkyModalInstance,
  ) {}
}
