import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './phone-field-input-box.component.fixture.html',
})
export class PhoneFieldInputBoxTestComponent {
  public hintText: string | undefined;
  public modelValue: string | undefined;
}
