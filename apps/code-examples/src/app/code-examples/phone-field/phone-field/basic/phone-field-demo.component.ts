import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-field-demo',
  templateUrl: './phone-field-demo.component.html',
  styleUrls: ['./phone-field-demo.component.scss'],
})
export class PhoneFieldDemoComponent implements OnInit {
  public phoneControl: UntypedFormControl;

  public phoneForm: UntypedFormGroup;

  public ngOnInit(): void {
    this.phoneControl = new UntypedFormControl();
    this.phoneForm = new UntypedFormGroup({
      phoneControl: this.phoneControl,
    });
  }
}
