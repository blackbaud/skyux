import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox-demo',
  templateUrl: './checkbox-demo.component.html',
})
export class CheckboxDemoComponent {
  public myForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      bold: new FormControl(false),
      italic: new FormControl(false),
      underline: new FormControl(false),
    });
  }

  public onSubmit(): void {
    console.log(this.myForm.value);
  }
}
