import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyAutocompleteModule } from '@skyux/lookup';

/**
 * @title Autocomplete with basic setup
 */
@Component({
  selector: 'app-lookup-autocomplete-basic-example',
  templateUrl: './example.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
})
export class LookupAutocompleteBasicExampleComponent {
  public colors: { name: string }[] = [
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

  public formGroup = inject(FormBuilder).group({
    favoriteColor: new FormControl<{ name: string } | undefined>(undefined),
  });
}
