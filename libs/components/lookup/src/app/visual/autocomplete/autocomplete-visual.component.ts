import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  SkyAutocompleteSelectionChange
} from '../../public/public_api';

@Component({
  selector: 'autocomplete-visual',
  templateUrl: './autocomplete-visual.component.html'
})
export class AutocompleteVisualComponent implements OnInit {
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
    { name: 'Black' }
  ];

  public templateDisabledState: boolean = false;

  private reactiveDisabledState: boolean = false;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      favoriteColor: undefined
    });
  }

  public toggleReactiveDisabled(): void {
    if (this.reactiveDisabledState) {
      this.reactiveForm.get('favoriteColor').enable();
    } else {
      this.reactiveForm.get('favoriteColor').disable();
    }

    this.reactiveDisabledState = !this.reactiveDisabledState;
  }

  public toggleTemplateDisabled(): void {
    this.templateDisabledState = !this.templateDisabledState;
  }

  public onSelectionChange(event: SkyAutocompleteSelectionChange): void {
    console.log(event);
  }

}
