import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

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
export class InlineFormDocsComponent implements OnInit {

  public inlineFormButtonLayoutChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { label: 'DoneCancel', value: SkyInlineFormButtonLayout.DoneCancel },
    { label: 'DoneDeleteCancel', value: SkyInlineFormButtonLayout.DoneDeleteCancel },
    { label: 'SaveCancel', value: SkyInlineFormButtonLayout.SaveCancel },
    { label: 'SaveDeleteCancel', value: SkyInlineFormButtonLayout.SaveDeleteCancel }
  ];

  public demoForm: FormGroup;

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

  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.demoForm = this.formBuilder.group({
      firstName: new FormControl()
    });
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    this.demoSettings.inlineFormConfig.buttonLayout = change.buttonLayout;
    this.demoSettings.inlineFormConfig = {...{ }, ...this.demoSettings.inlineFormConfig};
    this.changeDetector.markForCheck();
  }

  public onInlineFormClose(args: SkyInlineFormCloseArgs): void {
    if (args.reason === 'save' || args.reason === 'done') {
      this.demoSettings.firstName = this.demoForm.get('firstName').value;
    }

    this.demoForm.patchValue({
      firstName: undefined
    });
    this.demoSettings.showForm = false;
  }

  public onInlineFormOpen(): void {
    this.demoForm.patchValue({
      firstName: this.demoSettings.firstName
    });
    this.demoSettings.showForm = true;
  }

}
