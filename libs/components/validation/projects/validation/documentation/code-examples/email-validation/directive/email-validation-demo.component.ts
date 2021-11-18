import { Component } from '@angular/core';

@Component({
  selector: 'app-email-validation-demo',
  templateUrl: './email-validation-demo.component.html',
})
export class EmailValidationDemoComponent {
  public demoModel: {
    emailAddress?: string;
  } = {};
}
