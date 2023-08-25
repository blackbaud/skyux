import { AfterViewInit, Component, HostBinding, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkyCountryFieldCountry } from '@skyux/lookup';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-country-field',
  templateUrl: './country-field.component.html',
  styleUrls: ['./country-field.component.scss'],
})
export class CountryFieldComponent implements AfterViewInit {
  @HostBinding('class.sky-padding-even-md')
  public readonly classPaddingEvenMd = true;

  public countryForm: FormGroup;
  public ready = new BehaviorSubject<boolean>(false);

  constructor() {
    const fb = inject(FormBuilder);
    this.countryForm = fb.group({
      emptyCountryField: fb.control<SkyCountryFieldCountry | undefined>(
        undefined,
        Validators.required
      ),
      phoneInfoCountryField: fb.control<SkyCountryFieldCountry | undefined>(
        undefined,
        Validators.required
      ),
      disabledCountryField: fb.control<SkyCountryFieldCountry | undefined>(
        undefined,
        Validators.required
      ),
      prepopulatedCountryField: fb.control<SkyCountryFieldCountry | undefined>(
        {
          iso2: 'au',
          name: 'Australia',
        },
        Validators.required
      ),
      hideFlagPrepopulatedCountryField: fb.control<
        SkyCountryFieldCountry | undefined
      >({
        iso2: 'au',
        name: 'Australia',
      }),
      disabledPrepopulatedCountryField: fb.control<
        SkyCountryFieldCountry | undefined
      >({
        iso2: 'au',
        name: 'Australia',
      }),
    });
    ['disabledCountryField', 'disabledPrepopulatedCountryField'].forEach(
      (controlName) => {
        this.countryForm.get(controlName)?.disable();
      }
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ready.next(true);
    }, 200);
  }
}
