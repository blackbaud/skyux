import { Component, ViewChild } from '@angular/core';
import { SkyTextExpandRepeaterComponent } from '../text-expand-repeater.component';

@Component({
  selector: 'sky-text-expand-repeater-demo',
  templateUrl: './text-expand-repeater.component.fixture.html'
})
export class TextExpandRepeaterTestComponent {
  @ViewChild(SkyTextExpandRepeaterComponent, { read: SkyTextExpandRepeaterComponent })
  public textExpand: SkyTextExpandRepeaterComponent;
  public data: string[];
  public numItems: number;
}
