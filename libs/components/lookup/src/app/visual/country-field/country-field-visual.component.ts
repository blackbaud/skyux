import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  SkyCountryFieldCountry
} from '../../public/modules/country-field/types/country';

@Component({
  selector: 'country-field-visual',
  templateUrl: './country-field-visual.component.html',
  styleUrls: ['./country-field-visual.component.scss']
})
export class CountryFieldVisualComponent implements OnInit {

  public countryData: SkyCountryFieldCountry;

  public countryForm: FormGroup;

  public countryControl: FormControl;

  public disableFields: boolean = false;

  constructor() { }

  public ngOnInit(): void {
    this.countryControl = new FormControl();
    this.countryControl.setValue({
      name: 'Australia',
      iso2: 'au'
    });
    this.countryForm = new FormGroup({
      'countryControl': this.countryControl
    });

    this.countryControl.setValidators([Validators.required]);
  }

  public toggleDisabledStates(): void {
    if (this.disableFields) {
      this.countryControl.enable();
      this.disableFields = false;
    } else {
      this.countryControl.disable();
      this.disableFields = true;
    }
  }
}
