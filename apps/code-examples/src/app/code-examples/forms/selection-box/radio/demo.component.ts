import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyRadioModule, SkySelectionBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyIdModule,
    SkyRadioModule,
    SkySelectionBoxModule,
  ],
})
export class DemoComponent {
  protected items: Record<string, string>[] = [
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

  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      myOption: this.items[2]['value'],
    });
  }
}
