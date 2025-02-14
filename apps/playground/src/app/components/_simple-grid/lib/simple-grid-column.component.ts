/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  input,
  numberAttribute,
} from '@angular/core';

export type SkyGridColumnAlignment = 'left' | 'center' | 'right';

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
  /**
   * @deprecated This doesn't do anything?
   */
  public description = input<string>();
  public field = input<string>();
  public heading = input<string>();
  public hidden = input(false, { transform: booleanAttribute });
  public id = input<string>();
  public isSortable = input(true, { transform: booleanAttribute });
  public locked = input(false, { transform: booleanAttribute });
  public width = input(undefined, { transform: numberAttribute });
  public alignment = input<SkyGridColumnAlignment>('left');
  public template = input<TemplateRef<unknown> | undefined>(undefined);
}
