import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

@Component({
  selector: 'app-toggle-switch-docs',
  templateUrl: './toggle-switch-docs.component.html'
})
export class ToggleSwitchComponent {
  public demoSettings: any = {};
  public showLabel = true;
  public checked = false;

  public get switchLabel(): string {
    return (this.checked === true) ? 'Active' : 'Inactive';
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.toggleLabel !== undefined) {
      this.showLabel = change.toggleLabel;
    }
  }

  public onReset(): void {
    this.checked = false;
  }
}
