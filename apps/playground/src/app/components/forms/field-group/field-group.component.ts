import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import {
  SkyFieldGroupModule,
  SkyInputBoxModule,
  SkyRadioModule,
  SkyToggleSwitchModule,
} from '@skyux/forms';

interface Item {
  icon: string;
  label: string;
  name: string;
}

@Component({
  selector: 'app-field-group',
  templateUrl: './field-group.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyFieldGroupModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyRadioModule,
    SkyToggleSwitchModule,
  ],
})
export class FieldGroupComponent {
  public formGroup: FormGroup;

  #formBuilder = inject(FormBuilder);

  protected views: Item[] = [
    { icon: 'table', label: 'Table', name: 'table' },
    { icon: 'list', label: 'List', name: 'list' },
    { icon: 'map-marker', label: 'Map', name: 'map' },
  ];

  constructor() {
    this.formGroup = this.#formBuilder.group({
      name: new FormControl(undefined),
      hometown: new FormControl(undefined),
      toggle: new FormControl(false),
      radio: this.views[0].name,
    });
  }
}
