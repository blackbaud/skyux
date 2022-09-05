import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox-demo',
  templateUrl: './checkbox-demo.component.html',
})
export class CheckboxDemoComponent implements OnInit {
  public myForm: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      email: new UntypedFormControl(false),
      phone: new UntypedFormControl(false),
      text: new UntypedFormControl(false),
    });
  }

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }

  public onSubmit(): void {
    console.log(this.myForm.value);
  }
}
