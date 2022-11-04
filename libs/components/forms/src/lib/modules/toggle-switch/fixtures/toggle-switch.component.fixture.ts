import { Component } from '@angular/core';

@Component({
  templateUrl: './toggle-switch.component.fixture.html',
})
export class SkyToggleSwitchFixtureComponent {
  public isChecked = false;
  public isDisabled = false;
  public customTabIndex = 0;
  public multiple = false;
  public showInlineHelp = false;
  public showLabel = true;
  public ariaLabel: string | undefined;
  public buttonLabel: string | undefined = 'Simple toggle';

  public checkChanged(event: { checked: boolean }): void {
    this.isChecked = event.checked;
  }
}
