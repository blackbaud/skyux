import {
  Component
} from '@angular/core';

import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig
} from '@skyux/inline-form';

@Component({
  selector: 'app-inline-form-demo',
  templateUrl: './inline-form-demo.component.html',
  styleUrls: ['./inline-form-demo.component.scss']
})
export class InlineFormDemoComponent {

  public activeInlineFormId: string;

  public demoModel: {
    note?: string;
    title?: string;
  } = { };

  public inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.SaveCancel
  };

  public items: any[] = [
    {
      id: '1',
      title: '2019 Spring Gala',
      note: 'Gala for friends and family'
    },
    {
      id: '2',
      title: '2019 Special Winter Event',
      note: 'A special event'
    },
    {
      id: '3',
      title: '2019 Donor Appreciation Event',
      note: 'Event for all donors and families'
    },
    {
      id: '4',
      title: '2020 Spring Gala',
      note: 'Gala for friends and family'
    }
  ];

  public showInlineForm(item: any): void {
    this.activeInlineFormId = item.id;
    this.demoModel = {
      note: item.note,
      title: item.title
    };
  }

  public onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save') {
      const found = this.items.find(item => item.id === this.activeInlineFormId);
      found.note = this.demoModel.note;
      found.title = this.demoModel.title;
    }

    // Close the active form.
    this.activeInlineFormId = undefined;
  }

}
