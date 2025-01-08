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
  SkyAutocompleteModule,
  SkyAutocompleteSearchFunctionFilter,
  SkyAutocompleteSelectionChange,
} from '@skyux/lookup';

import { Planet } from './planet';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIdModule,
  ],
})
export class DemoComponent {
  protected farthestPlanet: FormControl;
  protected formGroup: FormGroup;

  protected planets: Planet[] = [
    {
      name: 'Mercury',
      description: 'Mercury is a planet in our solar system.',
    },
    { name: 'Venus', description: 'Venus is a planet in our solar system.' },
    { name: 'Earth', description: 'Earth is a planet in our solar system.' },
    { name: 'Mars', description: 'Mars is a planet in our solar system.' },
    {
      name: 'Jupiter',
      description: 'Jupiter is a planet in our solar system.',
    },
    { name: 'Saturn', description: 'Saturn is a planet in our solar system.' },
    { name: 'Uranus', description: 'Uranus is a planet in our solar system.' },
    {
      name: 'Neptune',
      description: 'Neptune is a planet in our solar system.',
    },
  ];

  protected searchFilters: SkyAutocompleteSearchFunctionFilter[] = [
    (searchText: string, item: Planet): boolean => {
      return item.name !== 'Red';
    },
  ];

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.farthestPlanet = this.#formBuilder.control({});
    this.formGroup = this.#formBuilder.group({
      farthestPlanet: this.farthestPlanet,
    });
  }

  protected onPlanetSelection(args: SkyAutocompleteSelectionChange): void {
    alert(`You selected ${(args.selectedItem as Planet).name}`);
  }
}
