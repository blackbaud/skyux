import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';

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

  public errorField: FormControl;

  public errorForm: FormGroup;

  public errorNgModelValue: string;

  @ViewChild('errorNgModel')
  public errorNgModel: NgModel;

  public ngOnInit(): void {
    this.errorField = new FormControl('', [Validators.required]);

    this.errorForm = new FormGroup({
      errorFormField: new FormControl('', [Validators.required]),
    });
  }
}
