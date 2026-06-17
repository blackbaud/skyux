import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  templateUrl: './toggle-switch-reactive-form.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyToggleSwitchReactiveFormFixtureComponent {
  public toggle1: UntypedFormControl = new UntypedFormControl(false);

  public toggleForm = new UntypedFormGroup({
    toggle1: this.toggle1,
  });
}
