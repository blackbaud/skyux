import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyToggleSwitchChange } from '../types/toggle-switch-change';

@Component({
  templateUrl: './toggle-switch-change-event.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyToggleSwitchChangeEventFixtureComponent {
  public lastEvent: SkyToggleSwitchChange | undefined;
}
