import { AsyncPipe } from '@angular/common';
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
  SkyCheckboxModule,
  SkyFieldGroupModule,
  SkyInputBoxModule,
  SkyRadioModule,
  SkyToggleSwitchModule,
} from '@skyux/forms';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Item {
  icon: string;
  label: string;
  name: string;
}

@Component({
  selector: 'app-field-group',
  templateUrl: './field-group.component.html',
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
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
    { icon: 'text-bullet-list', label: 'List', name: 'list' },
    { icon: 'location', label: 'Map', name: 'map' },
  ];
  protected lazyName = of('Name').pipe(delay(2200));

  constructor() {
    this.formGroup = this.#formBuilder.group({
      name: new FormControl(undefined),
      hometown: new FormControl(undefined),
      toggle: new FormControl(false),
      radio: this.views[0].name,
    });
  }
}
