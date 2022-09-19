import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-demo',
  templateUrl: './radio-demo.component.html',
})
export class RadioDemoComponent {
  public myForm: FormGroup;

  public options: any[] = [
    { name: 'Option 1', value: '1', disabled: false },
    { name: 'Option 2', value: '2', disabled: false },
    { name: 'Option 3 is disabled', value: '3', disabled: true },
  ];

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      myOption: this.options[0].name,
    });
  }

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
