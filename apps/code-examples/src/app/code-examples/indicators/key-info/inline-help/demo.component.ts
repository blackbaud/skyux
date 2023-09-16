import { Component, Input } from '@angular/core';
import {
  SkyHelpInlineModule,
  SkyKeyInfoLayoutType,
  SkyKeyInfoModule,
} from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyKeyInfoModule, SkyHelpInlineModule],
})
export class DemoComponent {
  @Input()
  public set value(value: number | undefined) {
    this.#_value = value;
    this.layout =
      this.#_value && this.#_value >= 100 ? 'vertical' : 'horizontal';
  }

  public get value(): number | undefined {
    return this.#_value;
  }

  protected layout: SkyKeyInfoLayoutType = 'vertical';

  #_value: number | undefined = 575;

  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
