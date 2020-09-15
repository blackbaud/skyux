import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

import {
  SkyInlineFormButtonLayout,
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig
} from '../../public/public_api';

@Component({
  selector: 'app-inline-form-docs',
  templateUrl: './inline-form-docs.component.html'
})
export class InlineFormDocsComponent {

  public inlineFormButtonLayoutChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { label: 'DoneCancel', value: SkyInlineFormButtonLayout.DoneCancel },
    { label: 'DoneDeleteCancel', value: SkyInlineFormButtonLayout.DoneDeleteCancel },
    { label: 'SaveCancel', value: SkyInlineFormButtonLayout.SaveCancel },
    { label: 'SaveDeleteCancel', value: SkyInlineFormButtonLayout.SaveDeleteCancel }
  ];

  public demoSettings: {
    firstName: string;
    inlineFormConfig: SkyInlineFormConfig;
    showForm: boolean;
  } = {
    firstName: 'Jane',
    inlineFormConfig: {
      buttonLayout: SkyInlineFormButtonLayout.SaveCancel
    },
    showForm: false
  };

  public demoModel: {
    firstName?: string;
  } = { };

  constructor(private changeDetector: ChangeDetectorRef) {
    this.demoModel.firstName = this.demoSettings.firstName;
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    this.demoSettings.inlineFormConfig.buttonLayout = change.buttonLayout;
    this.demoSettings.inlineFormConfig = {...{ }, ...this.demoSettings.inlineFormConfig};
    this.changeDetector.markForCheck();
  }

  public onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save' || args.reason === 'done') {
      this.demoSettings.firstName = this.demoModel.firstName;
    }

    this.demoSettings.showForm = false;
  }

}
