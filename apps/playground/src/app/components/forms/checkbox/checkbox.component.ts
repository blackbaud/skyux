import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent implements OnInit {
  public checkValue = true;

  public foo: boolean;

  public bar: boolean;

  public reactiveFormGroup: UntypedFormGroup;

  public required = true;

  public showInlineHelp = false;

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.reactiveFormGroup = this.formBuilder.group({
      reactiveCheckbox: [undefined],
    });
  }

  public toggleRequired(): void {
    this.required = !this.required;
  }

  public toggleInlineHelp(): void {
    this.showInlineHelp = !this.showInlineHelp;
  }
}
