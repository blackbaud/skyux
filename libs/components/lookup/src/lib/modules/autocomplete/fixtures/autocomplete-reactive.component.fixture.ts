import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { SkyAutocompleteComponent } from '../autocomplete.component';

@Component({
  selector: 'sky-autocomplete-reactive-fixture',
  templateUrl: './autocomplete-reactive.component.fixture.html',
  standalone: false,
})
export class SkyAutocompleteReactiveFixtureComponent implements OnInit {
  public reactiveForm: UntypedFormGroup | undefined;

  public data: { objectid?: string; name?: string; text?: string }[] = [
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

  public enableShowMore = false;
  public showAddButton = false;

  @ViewChild(SkyAutocompleteComponent, {
    read: SkyAutocompleteComponent,
    static: true,
  })
  public autocomplete!: SkyAutocompleteComponent;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;
  }

  public ngOnInit(): void {
    this.reactiveForm = this.#formBuilder.group({
      favoriteColor: undefined,
    });
  }

  public addButtonClicked(): void {
    return;
  }

  public disableForm(): void {
    this.reactiveForm?.get('favoriteColor')?.disable();
  }

  public enableForm(): void {
    this.reactiveForm?.get('favoriteColor')?.enable();
  }

  public onShowMoreClick(): void {
    return;
  }
}
