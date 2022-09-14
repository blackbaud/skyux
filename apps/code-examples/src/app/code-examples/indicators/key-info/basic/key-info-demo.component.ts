import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-key-info-demo',
  templateUrl: './key-info-demo.component.html',
})
export class KeyInfoDemoComponent {
  @Input()
  public set layout(value: 'vertical' | 'horizontal') {
    this.#_layout = value;
  }

  public get layout(): 'vertical' | 'horizontal' {
    return this.#_layout;
  }

  #_layout: 'vertical' | 'horizontal' = 'vertical';
}
