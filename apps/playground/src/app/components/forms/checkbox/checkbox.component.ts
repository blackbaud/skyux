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

  public indeterminate = false;

  public reactiveFormGroup: UntypedFormGroup;

  public required = true;

  public showInlineHelp = false;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;
  }

  public ngOnInit(): void {
    this.reactiveFormGroup = this.#formBuilder.group({
      reactiveCheckbox: [undefined],
    });
  }

  public toggleIndeterminate(): void {
    this.indeterminate = !this.indeterminate;
  }

  public toggleRequired(): void {
    this.required = !this.required;
  }

  public toggleInlineHelp(): void {
    this.showInlineHelp = !this.showInlineHelp;
  }
}
