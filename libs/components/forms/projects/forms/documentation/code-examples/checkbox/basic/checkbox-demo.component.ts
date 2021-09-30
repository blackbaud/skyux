import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

@Component({
  selector: 'app-checkbox-demo',
  templateUrl: './checkbox-demo.component.html'
})
export class CheckboxDemoComponent implements OnInit {

  public myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      email: new FormControl(false),
      phone: new FormControl(false),
      text: new FormControl(false)
    });
  }

  public onSubmit(): void {
    console.log(this.myForm.value);
  }
}
