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
  styles: '',
  template: '',
})
export class SkyGridColumnComponent {
  public field = input<string>();
  public headingText = input<string>();
  public hidden = input(false, { transform: booleanAttribute });
  public columnId = input<string>();
  public sortable = input(true, { transform: booleanAttribute });
  public lockPosition = input(false, { transform: booleanAttribute });
  public maxWidth = input(undefined, { transform: numberAttribute });
  public templateRef = input<TemplateRef<unknown> | undefined>(undefined);
  public textAlignment = input<SkyGridColumnAlignment>('left');
}
