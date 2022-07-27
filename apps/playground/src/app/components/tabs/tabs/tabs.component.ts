import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  public requiredValue1: string;

  public requiredValue2: boolean;

  public showWizard = false;

  public newTabClick() {}

  public openTabClick() {}

  public closeTab() {}

  public get step2Disabled(): boolean {
    return !this.requiredValue1;
  }

  public get step3Disabled(): boolean {
    return this.step2Disabled || !this.requiredValue2;
  }

  public validateStep1() {
    return true;
  }
}
