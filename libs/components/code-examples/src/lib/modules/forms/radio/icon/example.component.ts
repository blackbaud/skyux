import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyRadioModule } from '@skyux/forms';

interface Item {
  icon: string;
  label: string;
  name: string;
}

/**
 * @title Radio group with icons
 */
@Component({
  selector: 'app-forms-radio-icon-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyRadioModule],
})
export class FormsRadioIconExampleComponent {
  protected formGroup: FormGroup;

  protected views: Item[] = [
    { icon: 'table', label: 'Table', name: 'table' },
    { icon: 'text-number-list-ltr', label: 'List', name: 'list' },
    { icon: 'location', label: 'Map', name: 'map' },
  ];

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      myView: this.views[0].name,
    });
  }
}
