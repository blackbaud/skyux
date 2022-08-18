import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

interface Color {
  name: string;
  id: number;
}

@Component({
  selector: 'sky-test-autocomplete-1',
  templateUrl: './autocomplete-harness-test.component.html',
})
export class AutocompleteHarnessTestComponent {
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

  public enableShowMore = true;

  public myForm: FormGroup;

  public showAddButton = true;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      favoriteColor: undefined,
      customResultTemplate: new FormControl(),
      addShowMore: undefined,
    });
  }

  public disableForm() {
    this.myForm.disable();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onAddClick(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onShowMoreClick(): void {}
}
