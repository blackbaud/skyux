import { Component, Input } from '@angular/core';
import { SkyKeyInfoLayoutType } from '@skyux/indicators';

@Component({
  selector: 'app-key-info-demo',
  templateUrl: './key-info-demo.component.html',
})
export class KeyInfoDemoComponent {
  @Input()
  public set value(value: number | undefined) {
    this.#_value = value;
    this.layout = this.#_value >= 100 ? 'vertical' : 'horizontal';
  }

  public get value(): number {
    return this.#_value;
  }

  public layout: SkyKeyInfoLayoutType = 'vertical';

  #_value: number | undefined = 575;

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
