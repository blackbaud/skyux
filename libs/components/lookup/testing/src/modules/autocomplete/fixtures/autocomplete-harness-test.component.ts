import { Component, inject, input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

interface Color {
  name: string;
  id: number;
}

@Component({
  selector: 'sky-test-autocomplete-1',
  templateUrl: './autocomplete-harness-test.component.html',
  standalone: false,
})
export class AutocompleteHarnessTestComponent {
  public ariaLabelledby = input<string | undefined>(undefined);

  public colors: Color[] = [
    { name: 'Red', id: 1 },
    { name: 'Blue', id: 2 },
    { name: 'Green', id: 3 },
    { name: 'Orange', id: 4 },
    { name: 'Pink', id: 5 },
    { name: 'Purple', id: 6 },
    { name: 'Yellow', id: 7 },
    { name: 'Brown', id: 8 },
    { name: 'Turquoise', id: 9 },
    { name: 'White', id: 10 },
    { name: 'Black', id: 11 },
  ];

  public enableShowMore = input<boolean>(true);

  public myForm: UntypedFormGroup;

  public showAddButton = input<boolean>(true);

  public noResultFoundText = input<string | undefined>(undefined);

  constructor() {
    const formBuilder = inject(UntypedFormBuilder);

    this.myForm = formBuilder.group({
      favoriteColor: undefined,
      customResultTemplate: new UntypedFormControl(),
      addShowMore: undefined,
    });
  }

  public disableForm(): void {
    this.myForm.disable();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onAddClick(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onShowMoreClick(): void {}
}
