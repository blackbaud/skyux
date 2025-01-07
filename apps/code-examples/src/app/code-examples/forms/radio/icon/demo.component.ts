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

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyRadioModule],
})
export class DemoComponent {
  protected formGroup: FormGroup;

  protected views: Item[] = [
    { icon: 'table', label: 'Table', name: 'table' },
    { icon: 'list', label: 'List', name: 'list' },
    { icon: 'map-marker', label: 'Map', name: 'map' },
  ];

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      myView: this.views[0].name,
    });
  }
}
