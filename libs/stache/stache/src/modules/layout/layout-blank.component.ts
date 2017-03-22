import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-layout-blank',
  templateUrl: './layout-blank.component.html'
})
export class StacheLayoutBlankComponent {
  @Input()
  public identifier: string = 'blank';

  public getClassName(): string {
    return `stache-layout-${this.identifier}`;
  }
}
