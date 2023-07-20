/* eslint-disable @cspell/spellchecker */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import { SkyDatepickerModule } from '@skyux/datetime';
import {
  SkyCheckboxModule,
  SkyInputBoxModule,
  SkyRadioModule,
} from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyLookupModule } from '@skyux/lookup';
import { SkyModalInstance } from '@skyux/modals';
import { SkyModalModule } from '@skyux/modals';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyColorpickerModule,
    SkyDatepickerModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyInputBoxModule,
    SkyLookupModule,
    SkyModalModule,
    SkyRadioModule,
    ReactiveFormsModule,
  ],
})
export class ModalComponent {
  public form: UntypedFormGroup;
  public modal = inject(SkyModalInstance);

  #formBuilder = inject(UntypedFormBuilder);

  public constituent = new FormControl('');
  public fundraiser = new FormControl('');
  public contactDate = new FormControl('');
  public contactMethod = new FormControl('');
  public notes = new FormControl('');
  public sentiment = new FormControl('positive');
  public additionalContact = new FormControl(false);

  public constituents = [
    { name: 'Barbara Durr' },
    { name: 'Robert Hernandez' },
    { name: 'Cristeen Lunsford' },
  ];

  public fundraisers = [
    { name: 'Latrice Ashmore' },
    { name: 'Wonda Lumpkin' },
    { name: 'Ed Sipes' },
  ];

  constructor() {
    this.form = this.#formBuilder.group({
      constituent: this.constituent,
      fundraiser: this.fundraiser,
      contactDate: this.contactDate,
      contactMethod: this.contactMethod,
      notes: this.notes,
      sentiment: this.sentiment,
      additionalContact: this.additionalContact,
    });
  }
}
