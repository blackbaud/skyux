import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  SkySectionedFormService
} from '../../../public/public_api';

@Component({
  selector: 'app-demo-information-form',
  templateUrl: './demo-information-form.component.html'
})
export class DemoInformationFormComponent implements OnInit {

  public myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sectionedFormService: SkySectionedFormService
  ) { }

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      name: [undefined, Validators.required],
      id: [undefined, Validators.pattern('^[0-9]+$')]
    });

    this.sectionedFormService.requiredFieldChanged(true);

    this.myForm.valueChanges.subscribe((cal) => {
      this.sectionedFormService.invalidFieldChanged(!this.myForm.valid);
    });
  }
}
