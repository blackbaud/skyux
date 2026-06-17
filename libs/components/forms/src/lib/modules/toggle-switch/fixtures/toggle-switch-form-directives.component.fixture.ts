import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './toggle-switch-form-directives.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyToggleSwitchFormDirectivesFixtureComponent {
  public modelValue = false;
}
