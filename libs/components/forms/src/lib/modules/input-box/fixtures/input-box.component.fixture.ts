import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';

@Component({
  selector: 'sky-input-box-fixture',
  templateUrl: './input-box.component.fixture.html',
})
export class InputBoxFixtureComponent {
  @Input()
  public basicDisabled: boolean | undefined;

  @Input()
  public hasErrors: boolean | undefined;

  @Input()
  public insetIconDisabled: boolean | undefined;

  public errorField: FormControl;

  public errorForm: FormGroup;

  public errorNgModelValue: string | undefined;

  @ViewChild('errorNgModel')
  public errorNgModel!: NgModel;

  constructor() {
    this.errorField = new FormControl('', [Validators.required]);

    this.errorForm = new FormGroup({
      errorFormField: new FormControl('', [Validators.required]),
    });
  }
}
