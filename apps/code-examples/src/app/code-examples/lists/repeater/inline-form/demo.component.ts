import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
} from '@skyux/inline-form';
import { SkyRepeaterModule } from '@skyux/lists';

type Item = {
  id: string;
  title: string | undefined;
  note: string | undefined;
};

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyInputBoxModule,
    SkyRepeaterModule,
  ],
})
export class DemoComponent {
  protected activeInlineFormId: string | undefined;

  protected inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.SaveCancel,
  };

  protected items: Item[] = [
    {
      id: '1',
      title: '2019 Spring Gala',
      note: 'Gala for friends and family',
    },
    {
      id: '2',
      title: '2019 Special Winter Event',
      note: 'A special event',
    },
    {
      id: '3',
      title: '2019 Donor Appreciation Event',
      note: 'Event for all donors and families',
    },
    {
      id: '4',
      title: '2020 Spring Gala',
      note: 'Gala for friends and family',
    },
  ];

  protected formGroup: FormGroup;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      id: new FormControl(),
      title: new FormControl(),
      note: new FormControl(),
    });
  }

  protected showInlineForm(item: Item): void {
    this.activeInlineFormId = item.id;
    this.formGroup.patchValue({
      note: item.note,
      title: item.title,
    });
  }

  protected onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save') {
      const found = this.items.find(
        (item) => item.id === this.activeInlineFormId
      );
      if (found) {
        found.note = this.formGroup.get('note')?.value;
        found.title = this.formGroup.get('title')?.value;
      }
    }

    this.formGroup.patchValue({
      note: undefined,
      title: undefined,
    });

    // Close the active form.
    this.activeInlineFormId = undefined;
  }
}
