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
    buttonLayout: SkyInlineFormButtonLayout.SaveCancel
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
