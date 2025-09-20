import { Component, Input } from '@angular/core';
import { SkyKeyInfoLayoutType, SkyKeyInfoModule } from '@skyux/indicators';

/**
 * @title Key info with help key
 */
@Component({
  selector: 'app-indicators-key-info-help-key-example',
  templateUrl: './example.component.html',
  imports: [SkyKeyInfoModule],
})
export class IndicatorsKeyInfoHelpKeyExampleComponent {
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
}
