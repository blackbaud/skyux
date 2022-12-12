import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { RadioDemoItem } from './radio-demo-item';

@Component({
  selector: 'app-radio-demo',
  templateUrl: './radio-demo.component.html',
})
export class RadioDemoComponent {
  public myForm: UntypedFormGroup;

  public options: RadioDemoItem[] = [
    { name: 'Option 1', value: '1', disabled: false },
    { name: 'Option 2', value: '2', disabled: false },
    { name: 'Option 3 is disabled', value: '3', disabled: true },
  ];

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      myOption: this.options[0].name,
    });
  }

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
