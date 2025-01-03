import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyTabIndex, SkyTabsModule } from '@skyux/tabs';

@Component({
  selector: 'app-wizard-demo-modal',
  templateUrl: './wizard-modal.component.html',
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyTabsModule,
    SkyModalModule,
    ReactiveFormsModule,
  ],
})
export class WizardModalComponent implements OnInit {
  public myForm: UntypedFormGroup;
  public title = 'Wizard Tabset Example';
  public activeIndex: SkyTabIndex = 0;
  public step2Disabled = true;
  public step3Disabled = true;
  public saveDisabled = true;

  #formBuilder: UntypedFormBuilder;

  constructor(
    public instance: SkyModalInstance,
    formBuilder: UntypedFormBuilder,
  ) {
    this.#formBuilder = formBuilder;

    this.myForm = this.#formBuilder.group({
      requiredValue1: undefined,
      requiredValue2: false,
      requiredValue3: undefined,
    });
  }

  public ngOnInit(): void {
    this.myForm.valueChanges.subscribe(() => {
      this.checkRequirementsMet();
    });
  }

  public checkRequirementsMet(): void {
    this.step2Disabled = !this.myForm.get('requiredValue1')?.value;
    this.step3Disabled = !this.myForm.get('requiredValue2')?.value;
    this.saveDisabled = this.myForm.get('requiredValue3')?.value;
  }

  public onCancelClick(): void {
    this.instance.cancel();
  }

  public onSave(): void {
    this.instance.save();
  }
}
