import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-wizard-demo-modal',
  templateUrl: './wizard-demo-modal.component.html',
})
export class WizardDemoModalComponent implements OnInit {
  constructor(
    public instance: SkyModalInstance,
    private formBuilder: FormBuilder
  ) {}

  public newMemberForm: FormGroup;
  public title = 'New Member Sign-up';
  public activeIndex = 0;
  public step2Disabled = true;
  public step3Disabled = true;
  public saveDisabled = true;

  public firstName: FormControl;
  public middleName: FormControl;
  public lastName: FormControl;
  public phoneNumber: FormControl;
  public email: FormControl;
  public termsAccepted: FormControl;
  public mailingList: FormControl;

  public ngOnInit(): void {
    this.firstName = new FormControl('', Validators.required);
    this.middleName = new FormControl();
    this.lastName = new FormControl('', Validators.required);
    this.phoneNumber = new FormControl('', Validators.required);
    this.email = new FormControl('', Validators.required);
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

    this.newMemberForm.valueChanges.subscribe(() => {
      this.checkRequirementsMet();
    });
  }

  public checkRequirementsMet(): void {
    const requirement1Met =
      this.newMemberForm.get('firstName').value &&
      this.newMemberForm.get('lastName').value;
    const requirement2Met =
      this.newMemberForm.get('phoneNumber').value &&
      this.newMemberForm.get('phoneNumber').valid &&
      this.newMemberForm.get('email').value;
    const requirement3Met = this.newMemberForm.get('termsAccepted').value;

    this.step2Disabled = !requirement1Met;
    this.step3Disabled = !requirement2Met;
    this.saveDisabled = !requirement3Met;
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
