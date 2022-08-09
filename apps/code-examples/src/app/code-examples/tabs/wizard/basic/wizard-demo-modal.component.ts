import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyModalInstance } from '@skyux/modals';
import { SkyTheme, SkyThemeMode, SkyThemeSettings } from '@skyux/theme';

@Component({
  selector: 'app-wizard-demo-modal',
  templateUrl: './wizard-demo-modal.component.html',
})
export class WizardDemoModalComponent implements OnInit {
  constructor(
    public instance: SkyModalInstance,
    private formBuilder: FormBuilder
  ) {}

  public modernLightTheme = new SkyThemeSettings(
    SkyTheme.presets.modern,
    SkyThemeMode.presets.light
  );

  public newMemberForm: FormGroup;
  public title = 'New Member Sign-up';
  public activeIndex = 0;

  public firstName: FormControl;
  public middleName: FormControl;
  public lastName: FormControl;
  public phoneNumber: FormControl;
  public email: FormControl;
  public termsAccepted: FormControl;
  public mailingList: FormControl;

  public ngOnInit(): void {
    this.firstName = new FormControl();
    this.middleName = new FormControl();
    this.lastName = new FormControl();
    this.phoneNumber = new FormControl();
    this.email = new FormControl();
    this.termsAccepted = new FormControl(false);
    this.mailingList = new FormControl(false);

    this.newMemberForm = this.formBuilder.group({
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      termsAccepted: this.termsAccepted,
      mailingList: this.mailingList,
    });
  }

  public requirementsMet(stepIndex: number): boolean {
    const requirement1Met =
      this.newMemberForm.get('firstName').value &&
      this.newMemberForm.get('lastName').value;
    const requirement2Met =
      this.newMemberForm.get('phoneNumber').value &&
      this.newMemberForm.get('email').value;
    const requirement3Met = this.newMemberForm.get('termsAccepted').value;

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
