import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
  styleUrls: ['./selection-box.component.scss'],
})
export class SelectionBoxComponent {
  public myForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      checkbox1: new FormControl(false),
      checkbox2: new FormControl(false),
      myOption: '',
    });
  }
}
