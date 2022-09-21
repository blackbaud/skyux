import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SkyAutocompleteSearchFunctionFilter } from '@skyux/lookup';

@Component({
  selector: 'app-autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html',
})
export class AutocompleteDemoComponent implements OnInit {
  public colors: any[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' },
  ];

  public myForm: UntypedFormGroup;

  public searchFilters: SkyAutocompleteSearchFunctionFilter[] = [
    (searchText: string, item: any): boolean => {
      return item.name !== 'Red';
    },
  ];

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      favoriteColor: undefined,
    });
  }
}
