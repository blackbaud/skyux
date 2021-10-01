import {
  Component
} from '@angular/core';

@Component({
  selector: 'sky-test-wizard-form',
  templateUrl: './tabset-wizard.component.fixture.html'
})
export class SkyWizardTestFormComponent {
  public requiredValue1: string;

  public requiredValue2: boolean;

  public step2Disabled: boolean;

  public step3Disabled: boolean;

  public selectedTab = 0;

  constructor() { }

  public validateStep1() {
    return true;
  }
}
