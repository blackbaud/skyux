import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  selector: 'app-wizard-dropdown-demo-modal',
  templateUrl: './wizard-dropdown-demo-modal.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyTabsModule,
  ],
})
export class WizardDropdownDemoModalComponent implements OnInit {
  public myForm: UntypedFormGroup;
  public title = 'Wizard Tabset Example';
  public activeIndex = 0;
  public step2Disabled = true;
  public step3Disabled = true;
  public saveDisabled = true;

  #formBuilder: UntypedFormBuilder;

  constructor(
    public instance: SkyModalInstance,
    formBuilder: UntypedFormBuilder,
  ) {
    this.#formBuilder = formBuilder;
  }

  public ngOnInit(): void {
    this.myForm = this.#formBuilder.group({
      requiredValue1: undefined,
      requiredValue2: false,
      requiredValue3: undefined,
    });

    this.myForm.valueChanges.subscribe(() => {
      this.checkRequirementsMet();
    });
  }
  public checkRequirementsMet(): void {
    this.step2Disabled = !this.myForm.get('requiredValue1')?.value;
    this.step3Disabled = !this.myForm.get('requiredValue2')?.value;
    this.saveDisabled = !this.myForm.get('requiredValue3')?.value;
  }

  public onNextClick(): void {
    this.activeIndex++;
  }

  public onPrevClick(): void {
    this.activeIndex--;
  }

  public onCancelClick(): void {
    this.instance.cancel();
  }

  public onSave(): void {
    this.instance.save();
  }
}
