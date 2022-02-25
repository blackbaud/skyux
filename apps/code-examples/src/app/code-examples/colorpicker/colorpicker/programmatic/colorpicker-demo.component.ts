import { Component } from '@angular/core';

import {
  SkyColorpickerMessage,
  SkyColorpickerMessageType,
} from '@skyux/colorpicker';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-colorpicker-demo',
  templateUrl: './colorpicker-demo.component.html',
})
export class ColorpickerDemoComponent {
  public colorpickerController: Subject<SkyColorpickerMessage> =
    new Subject<SkyColorpickerMessage>();

  public model: any;

  public showResetButton: boolean = false;

  public openColorpicker(): void {
    this.sendMessage(SkyColorpickerMessageType.Open);
  }

  public resetColorpicker(): void {
    this.sendMessage(SkyColorpickerMessageType.Reset);
  }

  public toggleResetButton(): void {
    this.sendMessage(SkyColorpickerMessageType.ToggleResetButton);
  }

  private sendMessage(type: SkyColorpickerMessageType): void {
    const message: SkyColorpickerMessage = { type };
    this.colorpickerController.next(message);
  }
}
