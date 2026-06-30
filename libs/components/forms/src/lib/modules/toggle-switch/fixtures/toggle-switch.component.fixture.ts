import { Component, input, model } from '@angular/core';

@Component({
  templateUrl: './toggle-switch.component.fixture.html',
  standalone: false,
})
export class SkyToggleSwitchFixtureComponent {
  public isChecked = model<boolean>(false);
  public isDisabled = input<boolean>(false);
  public customTabIndex = input<number>(0);
  public multiple = input<boolean>(false);
  public showInlineHelp = input<boolean>(false);
  public showLabel = input<boolean>(true);
  public ariaLabel = input<string | undefined>(undefined);
  public buttonLabel = input<string | undefined>('Simple toggle');
  public helpKey = input<string | undefined>(undefined);
  public helpPopoverContent = input<string | undefined>(undefined);
  public helpPopoverTitle = input<string | undefined>(undefined);
  public labelText = input<string | undefined>(undefined);
  public labelHidden = input<boolean>(false);

  public checkChanged(event: { checked: boolean }): void {
    this.isChecked.set(event.checked);
  }
}
