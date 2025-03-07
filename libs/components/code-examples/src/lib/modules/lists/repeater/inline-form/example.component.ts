import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
} from '@skyux/inline-form';
import { SkyRepeaterModule } from '@skyux/lists';

interface DemoForm {
  id: FormControl<string>;
  note: FormControl<string>;
  title: FormControl<string>;
}

interface Item {
  id: string;
  title: string | undefined;
  note: string | undefined;
}

/**
 * @title Repeater with inline form
 */
@Component({
  selector: 'app-lists-repeater-inline-form-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyInputBoxModule,
    SkyRepeaterModule,
  ],
})
export class ListsRepeaterInlineFormExampleComponent {
  protected activeInlineFormId: string | undefined;
  protected formGroup: FormGroup<DemoForm>;

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

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      id: new FormControl('', { nonNullable: true }),
      title: new FormControl('', { nonNullable: true }),
      note: new FormControl('', { nonNullable: true }),
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
        (item) => item.id === this.activeInlineFormId,
      );
      if (found) {
        found.note = this.formGroup.value.note;
        found.title = this.formGroup.value.title;
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
