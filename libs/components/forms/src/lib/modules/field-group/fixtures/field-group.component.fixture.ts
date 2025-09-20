import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { SkyInputBoxModule } from '../../input-box/input-box.module';
import { SkyFieldGroupHeadingLevel } from '../field-group-heading-level';
import { SkyFieldGroupHeadingStyle } from '../field-group-heading-style';
import { SkyFieldGroupModule } from '../field-group.module';

@Component({
  selector: 'sky-field-group-fixture',
  templateUrl: './field-group.component.fixture.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyFieldGroupModule,
    SkyInputBoxModule,
  ],
})
export class FieldGroupComponent {
  protected formGroup: FormGroup;
  public stacked = false;
  public headingText = 'Heading text';
  public hintText: string | undefined;
  public headingHidden = false;
  public headingStyle: SkyFieldGroupHeadingStyle | undefined = 3;
  public headingLevel: SkyFieldGroupHeadingLevel | undefined = 3;
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      name: new FormControl(),
    });
  }
}
