import { Component, inject } from '@angular/core';
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
  public stacked = false;
  public headingText = 'Heading text';
  public hintText: string | undefined;
  public headingHidden = false;
  public headingLevel: SkyFieldGroupHeadingLevel = 3;
  public headingStyle: SkyFieldGroupHeadingStyle = 3;
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined = 'Popover content';
  public helpPopoverTitle = 'Popover title';

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      name: new FormControl(),
    });
  }
}
