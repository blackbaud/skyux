import { Component } from '@angular/core';

import { SkySectionedFormService } from './../sectioned-form.service';

@Component({
  selector: 'sky-sectioned-form-fixture-information-1',
  templateUrl: './sectioned-form-fixture-information-1.component.html',
  standalone: false,
})
export class SkySectionedFormFixtureInformation1Component {
  public get required(): boolean | undefined {
    return this.#_required;
  }

  public set required(value: boolean | undefined) {
    this.#_required = value;
    this.#sectionedFormService.requiredFieldChanged(value);
  }

  public get invalid(): boolean | undefined {
    return this.#_invalid;
  }

  public set invalid(value: boolean | undefined) {
    this.#_invalid = value;
    this.#sectionedFormService.invalidFieldChanged(value);
  }

  #_invalid: boolean | undefined;
  #_required: boolean | undefined;

  #sectionedFormService: SkySectionedFormService;

  constructor(sectionedFormService: SkySectionedFormService) {
    this.#sectionedFormService = sectionedFormService;
  }
}
