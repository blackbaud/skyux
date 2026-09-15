import { Component } from '@angular/core';
import { SkyButton } from '@skyux/forms';

@Component({
  selector: 'app-button-harness-test',
  templateUrl: './button-harness-test.html',
  imports: [SkyButton],
})
export class ButtonHarnessTest {
  public buttonClick(_: PointerEvent): void {
    //
  }
}
