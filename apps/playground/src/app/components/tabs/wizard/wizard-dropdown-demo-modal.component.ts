import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-wizard-dropdown-demo-modal',
  templateUrl: './wizard-dropdown-demo-modal.component.html',
})
export class WizardDropdownDemoModalComponent implements OnInit {
  public myForm: FormGroup;
  public title = 'Wizard Tabset Example';
  public activeIndex = 0;

  constructor(
    public instance: SkyModalInstance,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      requiredValue1: undefined,
      requiredValue2: false,
      requiredValue3: undefined,
    });
  }

  public requirementsMet(stepIndex: number): boolean {
    const requirement1Met = this.myForm.get('requiredValue1').value;
    const requirement2Met = this.myForm.get('requiredValue2').value;
    const requirement3Met = this.myForm.get('requiredValue3').value;

    switch (stepIndex) {
      case 0:
        return requirement1Met;
      case 1:
        return requirement1Met && requirement2Met;
      case 2:
        return requirement1Met && requirement2Met && requirement3Met;
      default:
        return false;
    }
  }

  public get nextDisabled(): boolean {
    return this.activeIndex === 2 || !this.requirementsMet(this.activeIndex);
  }

  public get prevDisabled(): boolean {
    return this.activeIndex === 0;
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

  public onSaveClick(): void {
    this.instance.save();
  }
}
