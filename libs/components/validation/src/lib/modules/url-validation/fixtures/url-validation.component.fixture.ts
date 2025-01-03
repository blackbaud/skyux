import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './url-validation.component.fixture.html',
  standalone: false,
})
export class UrlValidationTestComponent {
  public urlValidator: string | undefined;
}
