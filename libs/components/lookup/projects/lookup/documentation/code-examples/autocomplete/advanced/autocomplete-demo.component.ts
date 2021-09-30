import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  SkyAutocompleteSearchFunctionFilter,
  SkyAutocompleteSelectionChange
} from 'projects/lookup/src/public-api';

@Component({
  selector: 'app-autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html'
})
export class AutocompleteDemoComponent implements OnInit {

  public farthestPlanet: any;

  public myForm: FormGroup;

  public planets: any[] = [
    { name: 'Mercury', description: 'Mercury is a planet in our solar system.' },
    { name: 'Venus', description: 'Venus is a planet in our solar system.' },
    { name: 'Earth', description: 'Earth is a planet in our solar system.' },
    { name: 'Mars', description: 'Mars is a planet in our solar system.' },
    { name: 'Jupiter', description: 'Jupiter is a planet in our solar system.' },
    { name: 'Saturn', description: 'Saturn is a planet in our solar system.' },
    { name: 'Uranus', description: 'Uranus is a planet in our solar system.' },
    { name: 'Neptune', description: 'Neptune is a planet in our solar system.' }
  ];

  public searchFilters: SkyAutocompleteSearchFunctionFilter[] = [
    (searchText: string, item: any): boolean => {
      return (item.name !== 'Red');
    }
  ];

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.createForm();
  }

  public onPlanetSelection(args: SkyAutocompleteSelectionChange): void {
    alert(`You selected ${args.selectedItem.name}`);
  }

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      farthestPlanet: {}
    });
  }
}
