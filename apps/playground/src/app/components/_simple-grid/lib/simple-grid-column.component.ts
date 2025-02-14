/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

type SkySimpleGridColumnAlignment = 'left' | 'center' | 'right';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'sky-grid-column',
  styles: `
    :host {
      display: block;
    }
  `,
  template: ``,
})
export class SkySimpleGridColumnComponent {
  // Frequent
  /**
   * Question: What does this even do?
   */
  public description = input<string>();
  public field = input<string>();
  public heading = input<string>();
  public hidden = input(false, { transform: booleanAttribute });
  public id = input<string>();
  public isSortable = input(true, { transform: booleanAttribute });
  public locked = input(false, { transform: booleanAttribute });
  public width = input<number | undefined>();

  // Infrequent
  public alignment = input<SkySimpleGridColumnAlignment>('left');
}
