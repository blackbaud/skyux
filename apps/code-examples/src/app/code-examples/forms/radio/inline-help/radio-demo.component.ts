import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-demo',
  templateUrl: './radio-demo.component.html',
})
export class RadioDemoComponent implements OnInit {
  public myForm: UntypedFormGroup;

  public options: any[] = [
    { name: 'Option 1', value: '1', disabled: false },
    { name: 'Option 2', value: '2', disabled: false },
    { name: 'Option 3 is disabled', value: '3', disabled: true },
  ];

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      myOption: this.options[0].name,
    });
  }

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
