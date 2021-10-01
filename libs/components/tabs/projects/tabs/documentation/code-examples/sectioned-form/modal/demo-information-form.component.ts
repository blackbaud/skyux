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
} from '@skyux/tabs';

@Component({
  selector: 'app-demo-information-form',
  templateUrl: './demo-information-form.component.html'
})
export class DemoInformationFormComponent implements OnInit {
  public id: string = '5324901';
  public myForm: FormGroup;
  public name: string = '';
  public nameRequired = false;

  constructor(
    private formBuilder: FormBuilder,
    private sectionedFormService: SkySectionedFormService
  ) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      name: [this.name],
      nameRequired: [this.nameRequired],
      id: [this.id, Validators.pattern('^[0-9]+$')]
    });

    this.myForm.valueChanges.subscribe((changes) => {
      console.log(changes);
      this.id = changes.id;
      this.name = changes.name;
      this.nameRequired = changes.nameRequired;
      this.checkValidity();
    });
  }

  public checkValidity(): void {
    if (this.nameRequired) {
      this.myForm.get('name').setValidators([Validators.required]);
      this.sectionedFormService.requiredFieldChanged(true);
    } else {
      this.myForm.get('name').setValidators([]);
      this.sectionedFormService.requiredFieldChanged(false);
    }

    if (!this.myForm.get('name').value && this.nameRequired) {
      this.sectionedFormService.invalidFieldChanged(true);
    } else {
      this.sectionedFormService.invalidFieldChanged(false);
    }
  }
}
