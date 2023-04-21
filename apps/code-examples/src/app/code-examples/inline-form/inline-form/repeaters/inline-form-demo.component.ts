import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
} from '@skyux/inline-form';

import { InlineFormDemoItem } from './inline-form-demo-item';

@Component({
  selector: 'app-inline-form-demo',
  templateUrl: './inline-form-demo.component.html',
})
export class InlineFormDemoComponent {
  public activeInlineFormId: string | undefined;

  public inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.SaveCancel,
  };

  public items: InlineFormDemoItem[] = [
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

  public myForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      id: new FormControl(),
      title: new FormControl(),
      note: new FormControl(),
    });
  }

  public showInlineForm(item: InlineFormDemoItem): void {
    this.activeInlineFormId = item.id;
    this.myForm.patchValue({
      note: item.note,
      title: item.title,
    });
  }

  public onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save') {
      const found = this.items.find(
        (item) => item.id === this.activeInlineFormId
      );
      if (found) {
        found.note = this.myForm.get('note')?.value;
        found.title = this.myForm.get('title')?.value;
      }
    }

    this.myForm.patchValue({
      note: undefined,
      title: undefined,
    });

    // Close the active form.
    this.activeInlineFormId = undefined;
  }
}
