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
  public id: string = '5324901';
  public myForm: FormGroup;
  public name: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private sectionedFormService: SkySectionedFormService
  ) {
    this.sectionedFormService.requiredFieldChanged(true);
  }

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      id: [this.id, Validators.pattern('^[0-9]+$')]
    });

    this.sectionedFormService.requiredFieldChanged(true);

    this.myForm.valueChanges.subscribe((cal) => {
      this.checkValidity();
    });
  }

  public checkValidity(): void {
    if (!this.myForm.get('name').value) {
      this.sectionedFormService.invalidFieldChanged(true);
    } else {
      this.sectionedFormService.invalidFieldChanged(false);
    }
  }
}
