import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './email-validation.component.fixture.html',
  standalone: false,
})
export class EmailValidationTestComponent {
  public emailValidator: string | undefined;
}
