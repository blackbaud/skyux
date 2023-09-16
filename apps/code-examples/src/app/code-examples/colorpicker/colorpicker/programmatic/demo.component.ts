import { Component } from '@angular/core';
import {
  SkyColorpickerMessage,
  SkyColorpickerMessageType,
  SkyColorpickerModule,
} from '@skyux/colorpicker';

import { Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyColorpickerModule],
})
export class DemoComponent {
  protected colorpickerController = new Subject<SkyColorpickerMessage>();

  protected showResetButton = false;

  protected openColorpicker(): void {
    this.#sendMessage(SkyColorpickerMessageType.Open);
  }

  protected resetColorpicker(): void {
    this.#sendMessage(SkyColorpickerMessageType.Reset);
  }

  protected toggleResetButton(): void {
    this.#sendMessage(SkyColorpickerMessageType.ToggleResetButton);
  }

  #sendMessage(type: SkyColorpickerMessageType): void {
    const message: SkyColorpickerMessage = { type };
    this.colorpickerController.next(message);
  }
}
