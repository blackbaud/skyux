import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { SkyModalInstance } from '@skyux/modals';

import {
  SkyProgressIndicatorActionClickArgs,
  SkyProgressIndicatorChange,
  SkyProgressIndicatorDisplayMode,
} from '@skyux/progress-indicator';

@Component({
  selector: 'app-wizard-demo-modal',
  templateUrl: './wizard-demo-modal.component.html',
})
export class WizardDemoModalComponent implements OnInit {
  public activeIndex = 0;

  public displayMode = SkyProgressIndicatorDisplayMode.Horizontal;

  public myForm: FormGroup;

  public title = 'Wizard example';

  public get requirementsMet(): boolean {
    switch (this.activeIndex) {
      case 0:
        return !!this.myForm.get('requiredValue1').value;
      case 1:
        return !!this.myForm.get('requiredValue2').value;
      default:
        return false;
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    public instance: SkyModalInstance
  ) {}

  public ngOnInit() {
    this.myForm = this.formBuilder.group({
      requiredValue1: undefined,
      requiredValue2: undefined,
    });
  }

  public onCancelClick(): void {
    this.instance.cancel();
  }

  public onSaveClick(args: SkyProgressIndicatorActionClickArgs): void {
    args.progressHandler.advance();
    this.instance.save();
  }

  public updateIndex(changes: SkyProgressIndicatorChange): void {
    this.activeIndex = changes.activeIndex;
  }
}
