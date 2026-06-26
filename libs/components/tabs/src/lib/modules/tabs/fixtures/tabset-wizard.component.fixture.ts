import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-test-wizard-form',
  templateUrl: './tabset-wizard.component.fixture.html',
  standalone: false,
})
export class SkyWizardTestFormComponent {
  public requiredValue1: string | undefined;

  public requiredValue2: boolean | undefined;

  public step2Disabled: boolean | undefined;

  public step3Disabled = input<boolean | undefined>(undefined);

  public selectedTab = input<number>(0);

  public finishDisabled: boolean | undefined = undefined;

  public passTabset = input<boolean>(true);

  public onSave = (): void => {
    return;
  };

  public validateStep1() {
    return true;
  }
}
