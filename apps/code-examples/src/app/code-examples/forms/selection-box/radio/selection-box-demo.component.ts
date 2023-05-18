import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-selection-box-demo',
  templateUrl: './selection-box-demo.component.html',
})
export class SelectionBoxDemoComponent implements OnInit {
  public items: Record<string, string>[] = [
    {
      name: 'Save time and effort',
      icon: 'clock',
      description:
        'Automate mundane tasks and spend more time on the things that matter.',
      value: 'clock',
    },
    {
      name: 'Boost engagement',
      icon: 'user',
      description: 'Encourage supporters to interact with your organization.',
      value: 'engagement',
    },
    {
      name: 'Build relationships',
      icon: 'users',
      description:
        'Connect to supporters on a personal level and maintain accurate data.',
      value: 'relationships',
    },
  ];

  public myForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      myOption: this.items[2]['value'],
    });
  }

  public ngOnInit(): void {
    this.myForm.valueChanges.subscribe((value) => console.log(value));
  }
}
