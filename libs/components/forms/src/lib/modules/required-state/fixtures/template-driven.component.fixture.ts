import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TestControlComponent } from './test-control.component.fixture';

@Component({
  imports: [FormsModule, TestControlComponent],
  template: `<sky-test-control [required]="required" [(ngModel)]="foobar" />`,
})
export class TemplateDrivenTestComponent {
  public required = false;

  protected foobar = '';
}
