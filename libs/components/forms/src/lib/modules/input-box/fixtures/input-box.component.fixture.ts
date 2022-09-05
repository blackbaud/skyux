import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  NgModel,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-input-box-fixture',
  templateUrl: './input-box.component.fixture.html',
})
export class InputBoxFixtureComponent implements OnInit {
  @Input()
  public basicDisabled: boolean;

  @Input()
  public hasErrors: boolean;

  @Input()
  public insetIconDisabled: boolean;

  public errorField: UntypedFormControl;

  public errorForm: UntypedFormGroup;

  public errorNgModelValue: string;

  @ViewChild('errorNgModel')
  public errorNgModel: NgModel;

  public ngOnInit(): void {
    this.errorField = new UntypedFormControl('', [Validators.required]);

    this.errorForm = new UntypedFormGroup({
      errorFormField: new UntypedFormControl('', [Validators.required]),
    });
  }
}
