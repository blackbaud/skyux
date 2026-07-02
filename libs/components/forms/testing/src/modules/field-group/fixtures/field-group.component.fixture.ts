import { Component, inject, model } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SkyFieldGroupHeadingLevel,
  SkyFieldGroupHeadingStyle,
  SkyFieldGroupModule,
  SkyInputBoxModule,
} from '@skyux/forms';

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
  public stacked = model(false);
  public headingText = model('Heading text');
  public hintText = model<string | undefined>(undefined);
  public headingHidden = model(false);
  public headingLevel = model<SkyFieldGroupHeadingLevel>(3);
  public headingStyle = model<SkyFieldGroupHeadingStyle>(3);
  public helpKey = model<string | undefined>(undefined);
  public helpPopoverContent = model<string | undefined>('Popover content');
  public helpPopoverTitle = model('Popover title');

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      name: new FormControl(),
    });
  }
}
