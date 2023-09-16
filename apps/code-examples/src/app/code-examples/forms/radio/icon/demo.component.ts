import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyRadioModule } from '@skyux/forms';

type Item = {
  icon: string;
  label: string;
  name: string;
};

@Component({
  standalone: true,
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

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      myView: this.views[0].name,
    });
  }
}
