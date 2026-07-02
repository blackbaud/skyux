import { Component, inject, input } from '@angular/core';
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
  public stacked = input(false);
  public headingText = input('Heading text');
  public hintText = input<string | undefined>(undefined);
  public headingHidden = input(false);
  public headingStyle = input<SkyFieldGroupHeadingStyle | undefined>(3);
  public headingLevel = input<SkyFieldGroupHeadingLevel | undefined>(3);
  public helpKey = input<string | undefined>(undefined);
  public helpPopoverContent = input<string | undefined>(undefined);
  public helpPopoverTitle = input<string | undefined>(undefined);

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      name: new FormControl(),
    });
  }
}
