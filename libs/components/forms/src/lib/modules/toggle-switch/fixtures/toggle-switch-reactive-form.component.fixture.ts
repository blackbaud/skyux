import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  templateUrl: './toggle-switch-reactive-form.component.fixture.html',
})
export class SkyToggleSwitchReactiveFormFixtureComponent {
  public toggle1: FormControl = new FormControl(false);

  public toggleForm = new FormGroup({
    toggle1: this.toggle1,
  });
}
