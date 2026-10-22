import { Component, input } from '@angular/core';
import { SkyInputBoxButton, SkyInputBoxModule } from '@skyux/forms';

@Component({
  selector: 'test-input-box-button-harness',
  imports: [SkyInputBoxModule, SkyInputBoxButton],
  templateUrl: './input-box-button-harness-test.html',
})
export class InputBoxButtonHarnessTest {
  public readonly disabled = input(false);
  public clickCount = 0;
}
