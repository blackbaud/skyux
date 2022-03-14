import { Component } from '@angular/core';

@Component({
  templateUrl: './toggle-switch.component.fixture.html',
})
export class SkyToggleSwitchFixtureComponent {
  public isChecked = false;
  public isDisabled = false;
  public customTabIndex = 0;
  public multiple = false;

  public checkChanged(event: any): void {
    this.isChecked = event.checked;
  }
}
