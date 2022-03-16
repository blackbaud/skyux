import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-layout-blank',
  templateUrl: './layout-blank.component.html',
  styleUrls: ['./layout-blank.component.scss'],
})
export class StacheLayoutBlankComponent {
  @Input()
  public identifier = 'blank';

  public getClassName(): string {
    return `stache-layout-${this.identifier}`;
  }
}
