import {
  Component
} from '@angular/core';

@Component({
  templateUrl: './toggle-switch.component.fixture.html'
})
export class SkyToggleSwitchFixtureComponent {

  public isChecked: boolean = false;
  public isDisabled: boolean = false;
  public customTabIndex: number = 0;
  public multiple: boolean = false;

  public checkChanged(event: any): void {
    this.isChecked = event.checked;
  }
}
