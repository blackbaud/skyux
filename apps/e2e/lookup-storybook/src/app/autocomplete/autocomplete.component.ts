import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyAutocompleteSelectionChange,
} from '@skyux/lookup';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent {
  public reactiveForm: FormGroup;

  public templateDrivenModel: any;

  public data: any[] = [
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

  public templateDisabledState = false;

  private reactiveDisabledState = false;

  constructor(private formBuilder: FormBuilder) {
    this.reactiveForm = this.formBuilder.group({
      favoriteColor: undefined,
      favoriteColorAsync: undefined,
    });
  }

  public toggleReactiveDisabled(): void {
    if (this.reactiveDisabledState) {
      this.reactiveForm.get('favoriteColor')?.enable();
    } else {
      this.reactiveForm.get('favoriteColor')?.disable();
    }

    this.reactiveDisabledState = !this.reactiveDisabledState;
  }

  public toggleTemplateDisabled(): void {
    this.templateDisabledState = !this.templateDisabledState;
  }

  public onSelectionChange(event: SkyAutocompleteSelectionChange): void {
    console.log(event);
  }

  public favoriteColorSearch(args: SkyAutocompleteSearchAsyncArgs): void {
    const searchText = (args.searchText || '').toLowerCase();

    const filteredData = this.data.filter(
      (item) => item.name.toLowerCase().indexOf(searchText) >= 0
    );

    args.result = of({
      items: filteredData,
      totalCount: filteredData.length,
    }).pipe(delay(1000));
  }
}
