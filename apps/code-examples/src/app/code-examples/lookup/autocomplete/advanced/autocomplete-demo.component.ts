import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  SkyAutocompleteSearchFunctionFilter,
  SkyAutocompleteSelectionChange,
} from '@skyux/lookup';

import { Planet } from './planet';

@Component({
  selector: 'app-autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent {
  public farthestPlanet: UntypedFormControl;

  public myForm: UntypedFormGroup;

  public planets: Planet[] = [
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

  public searchFilters: SkyAutocompleteSearchFunctionFilter[] = [
    (searchText: string, item: Planet): boolean => {
      return item.name !== 'Red';
    },
  ];

  constructor(private formBuilder: UntypedFormBuilder) {
    this.farthestPlanet = this.formBuilder.control({});
    this.myForm = this.formBuilder.group({
      farthestPlanet: this.farthestPlanet,
    });
  }

  public onPlanetSelection(args: SkyAutocompleteSelectionChange): void {
    alert(`You selected ${args.selectedItem.name}`);
  }
}
