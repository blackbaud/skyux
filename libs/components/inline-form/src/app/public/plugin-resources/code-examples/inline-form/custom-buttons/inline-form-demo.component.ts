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
  templateUrl: './inline-form-demo.component.html'
})
export class InlineFormDemoComponent {

  public demoModel: {
    firstName?: string;
  } = { };

  public firstName: string = 'Jane';

  public inlineFormConfig: SkyInlineFormConfig = {
    buttonLayout: SkyInlineFormButtonLayout.Custom,
    buttons: [
      { action: 'save', text: 'Save', styleType: 'primary' },
      { action: 'delete', text: 'Delete', styleType: 'default' },
      { action: 'reset', text: 'Reset', styleType: 'default' },
      { action: 'cancel', text: 'Cancel', styleType: 'link' }
    ]
  };

  public showForm: boolean = false;

  constructor() {
    this.demoModel.firstName = this.firstName;
  }

  public onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save') {
      this.firstName = this.demoModel.firstName;
    }

    this.showForm = false;
  }

}
